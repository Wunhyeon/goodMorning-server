import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/module/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/entity/user.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/module/admin/admin.service';
import { HashUtil } from 'src/util/hash.util';
import { constantString } from 'src/global/global.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly hashUtil: HashUtil,
  ) {}
  // acUser용
  async validateAcUser(email: string, password: string) {
    const user = await this.userService.findOneByUserEmail(email);

    const hashedPassword = this.hashUtil.makeHash(password);

    if (user && user.password === hashedPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  // masterUser용
  async validateMasterUser(email: string, password: string) {
    const masterUser = await this.adminService.fineOneByUserEmailMasterUser(
      email,
    );

    const hashedPassword = this.hashUtil.makeHash(password); // 나중에 admin계정 만들 때, 따로 admin계정용으로 saltKey를 만들어서 해야겠다.

    if (masterUser && masterUser.password === hashedPassword) {
      const { password, ...result } = masterUser;
      return result;
    }
    return null;
  }

  async acUserlogin(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      // authorityPolicy: user.authorityPolicy,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async masterUserLogin(masterUser: MasterUser) {
    const payload = {
      id: masterUser.id,
      email: masterUser.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getCookieWithJwtAccessToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      // authorityPolicy: acUser.authorityPolicy,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('AC_USER_JWT_ACCESS_SECRET'),
      expiresIn: constantString.AC_USER_JWT_ACCESS_EXPIRATION_TIME * 1000, // expiresIn은 ms단위이기 때문에 * 1000해줘야 함
    });

    if (process.env.NODE_ENV === 'dev') {
      return `${constantString.AC_USER_JWT_ACCESS_NAME}=${token}; HttpOnly; Path=/; Max-Age=${constantString.AC_USER_JWT_ACCESS_EXPIRATION_TIME}`;
    } else {
      return `${constantString.AC_USER_JWT_ACCESS_NAME}=${token}; HttpOnly; SameSite=None; Secure; Domain=.${process.env.DOMAIN};  Path=/; Max-Age=${constantString.AC_USER_JWT_ACCESS_EXPIRATION_TIME}`;
    }
  }

  getCookieWithJwtRefreshToken(user: User) {
    const payload = {
      id: user.id,
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
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('MASTER_USER_JWT_ACCESS_SECRET'),
      expiresIn: constantString.MASTER_USER_JWT_ACCESS_EXPIRATION_TIME,
    });

    return `${constantString.MASTER_USER_JWT_ACCESS_NAME}=${token}; HttpOnly; Path=/; Max-Age=${constantString.MASTER_USER_JWT_ACCESS_EXPIRATION_TIME}`;
  }

  masterGetCookieWithJwtRefreshToken(user: User) {
    const payload = {
      id: user.id,
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
