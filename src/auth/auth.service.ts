import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AcUserService } from 'src/module/ac-user/ac-user.service';
import { JwtService } from '@nestjs/jwt';
import { AcUser } from 'src/model/entity/acUser.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/module/admin/admin.service';
import { HashUtil } from 'src/util/hash.util';
import { constantString } from 'src/global/global.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AcUserService))
    private acUserService: AcUserService,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly hashUtil: HashUtil,
  ) {}
  // acUser용
  async validateAcUser(email: string, password: string) {
    const acUser = await this.acUserService.findOneByUserEmail(email);

    if (acUser && acUser.password === password) {
      const { password, ...result } = acUser;
      return result;
    }

    return null;
  }

  // masterUser용
  async validateMasterUser(email: string, password: string) {
    const masterUser = await this.adminService.fineOneByUserEmailMasterUser(
      email,
    );

    const hashedPassword = this.hashUtil.makeHash(password);

    if (masterUser && masterUser.password === hashedPassword) {
      const { password, ...result } = masterUser;
      return result;
    }
    return null;
  }

  async acUserlogin(acUser: AcUser) {
    const payload = {
      id: acUser.id,
      email: acUser.email,
      authorityPolicy: acUser.authorityPolicy,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async masterUserLogin(masterUser: MasterUser) {
    const payload = {
      id: masterUser.id,
      email: masterUser.email,
      accelerator: masterUser.accelerator,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getCookieWithJwtAccessToken(acUser: AcUser) {
    const payload = {
      id: acUser.id,
      email: acUser.email,
      // authorityPolicy: acUser.authorityPolicy,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('AC_USER_JWT_ACCESS_SECRET'),
      expiresIn: constantString.AC_USER_JWT_ACCESS_EXPIRATION_TIME,
    });

    return `${constantString.AC_USER_JWT_ACCESS_NAME}=${token}; HttpOnly; Path=/; Max-Age=${constantString.AC_USER_JWT_ACCESS_EXPIRATION_TIME}`;
  }

  getCookieWithJwtRefreshToken(acUser: AcUser) {
    const payload = {
      id: acUser.id,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('AC_USER_JWT_REFRESH_SECRET'),
      expiresIn: constantString.AC_USER_JWT_REFRESH_EXPIRATION_TIME,
    });

    //
    const cookie = `${constantString.AC_USER_JWT_REFRESH_NAME}=${token}; HttpOnly; Path=/; Max-Age=${constantString.AC_USER_JWT_REFRESH_EXPIRATION_TIME}`;
    return {
      token,
      cookie,
    };
  }

  masterGetCookieWithJwtAccessToken(masterUser: MasterUser) {
    const payload = {
      id: masterUser.id,
      email: masterUser.email,
      accelerator: masterUser.accelerator.id,
      // authorityPolicy: acUser.authorityPolicy,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('MASTER_USER_JWT_ACCESS_SECRET'),
      expiresIn: constantString.MASTER_USER_JWT_ACCESS_EXPIRATION_TIME,
    });

    return `${constantString.MASTER_USER_JWT_ACCESS_NAME}=${token}; HttpOnly; Path=/; Max-Age=${constantString.MASTER_USER_JWT_ACCESS_EXPIRATION_TIME}`;
  }

  masterGetCookieWithJwtRefreshToken(acUser: AcUser) {
    const payload = {
      id: acUser.id,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('MASTER_USER_JWT_REFRESH_SECRET'),
      expiresIn: constantString.MASTER_USER_JWT_REFRESH_EXPIRATION_TIME,
    });

    const cookie = `${constantString.MASTER_USER_JWT_REFRESH_NAME}=${token}; HttpOnly; Path=/; Max-Age=${constantString.MASTER_USER_JWT_REFRESH_EXPIRATION_TIME}`;
    //
    return {
      token,
      cookie,
    };
  }
}
