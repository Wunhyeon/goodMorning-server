import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { constantString, errorString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { Repository } from 'typeorm';
import { pbkdf2Sync } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { HashUtil } from 'src/util/hash.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, constantString.morningeeConnection)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    private configService: ConfigService,

    private readonly hashUtil: HashUtil,
  ) {}

  async findOneByUserEmail(email: string) {
    return this.userRepository.findOne({
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

    await this.userRepository.update(
      { id: user.id },
      {
        currentHashedRefreshToken:
          currentHashedRefreshTokenBuffer.toString('base64'),
      },
    );
  }

  // user의 refreshToken 비교
  async getUserIfRefreshTokenMatches(refreshToken: string, user: User) {
    const userInfo = await this.userRepository.findOne({
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
      throw new UnauthorizedException(errorString.REFRESH_TOKEN_ERROR);
    }

    return userInfo;
  }

  /**
   * 비밀번호 해쉬해서 업데이트
   * @param userId
   * @param password
   */
  async updatePassword(userId: number, password: string) {
    const hashedPassword = this.hashUtil.makeHash(password);

    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
