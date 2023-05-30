import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { constantString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { Repository } from 'typeorm';
import { pbkdf2Sync } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, constantString.morningeeConnection)
    private acUserRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    private configService: ConfigService,
  ) {}

  async findOneByUserEmail(email: string) {
    return this.acUserRepository.findOne({
      where: { email: email },
    });
  }

  // refreshToken 갱신
  async setCurrentRefreshToken(refreshToken: string, user: User) {
    const currentHashedRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    await this.acUserRepository.update(
      { id: user.id },
      {
        currentHashedRefreshToken:
          currentHashedRefreshTokenBuffer.toString('base64'),
      },
    );
  }

  // user의 refreshToken 비교
  async getUserIfRefreshTokenMatches(refreshToken: string, user: User) {
    const userInfo = await this.acUserRepository.findOne({
      where: { id: user.id },
      select: ['id', 'email', 'currentHashedRefreshToken'],
    });

    const requestRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    const requestRefreshToken = requestRefreshTokenBuffer.toString('base64');

    if (userInfo.currentHashedRefreshToken !== requestRefreshToken) {
      throw new UnauthorizedException();
    }

    return userInfo;
  }
}
