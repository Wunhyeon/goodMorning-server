import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { constantString } from 'src/global/global.constants';
import { AcUser } from 'src/model/entity/acUser.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { Repository } from 'typeorm';
import { pbkdf2Sync } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AcUserService {
  constructor(
    @InjectRepository(AcUser, constantString.latticeConnection)
    private acUserRepository: Repository<AcUser>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    private configService: ConfigService,
  ) {}

  async findOneByUserEmail(email: string) {
    return this.acUserRepository.findOne({
      where: { email: email },
      relations: { authorityPolicy: true },
    });
  }

  // refreshToken 갱신
  async setCurrentRefreshToken(refreshToken: string, acUser: AcUser) {
    const currentHashedRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    await this.acUserRepository.update(
      { id: acUser.id },
      {
        currentHashedRefreshToken:
          currentHashedRefreshTokenBuffer.toString('base64'),
      },
    );
  }

  // user의 refreshToken 비교
  async getUserIfRefreshTokenMatches(refreshToken: string, acUser: AcUser) {
    const acUserInfo = await this.acUserRepository.findOne({
      where: { id: acUser.id },
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

    if (acUserInfo.currentHashedRefreshToken !== requestRefreshToken) {
      throw new UnauthorizedException();
    }

    return acUserInfo;
  }
}
