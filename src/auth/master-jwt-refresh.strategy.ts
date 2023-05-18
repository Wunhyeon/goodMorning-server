import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { AdminService } from 'src/module/admin/admin.service';
import { MasterUser } from 'src/model/entity/masterUser.entity';

@Injectable()
export class MasterJwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'master-jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.masterUserRefreshToken;
        },
      ]),
      secretOrKey: configService.get('MASTER_USER_JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: MasterUser) {
    const refreshToken = request.cookies?.masterUserRefreshToken;
    return this.adminService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload,
    );
  }
}
