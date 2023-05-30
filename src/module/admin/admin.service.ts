import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { pbkdf2Sync } from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { constantString } from 'src/global/global.constants';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { masterUserRepository } from 'src/model/repository/masterUser.repository';

@Injectable()
export class AdminService {
  constructor(
    // @InjectRepository(MasterUser, constantString.latticeConnection)
    // private masterUserRepository: Repository<MasterUser>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService,
    @InjectDataSource(constantString.morningeeConnection)
    private dataSource: DataSource, // @InjectRepository(AcTech, constantString.latticeConnection)
  ) {}

  // masterUser
  async fineOneByUserEmailMasterUser(email: string) {
    // return this.masterUserRepository.findOne({
    //   where: { email: email },
    //   relations: ['accelerator'],
    // });

    return await masterUserRepository.selectMasterUserByEmail(email);
  }

  // refreshToken 갱신
  async setCurrentRefreshToken(refreshToken: string, masterUser: MasterUser) {
    const currentHashedRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('MASTER_CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    await masterUserRepository.update(
      { id: masterUser.id },
      {
        currentHashedRefreshToken:
          currentHashedRefreshTokenBuffer.toString('base64'),
      },
    );
  }

  // masterUser의 refreshToken 비교
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    masterUser: MasterUser,
  ) {
    const masterUserInfo = await masterUserRepository.findOne({
      where: { id: masterUser.id },
      select: ['id', 'email', 'currentHashedRefreshToken'],
    });

    const requestRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('MASTER_CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    const requestRefreshToken = requestRefreshTokenBuffer.toString('base64');

    if (masterUserInfo.currentHashedRefreshToken !== requestRefreshToken) {
      throw new UnauthorizedException();
    }

    return masterUserInfo;
  }
}
