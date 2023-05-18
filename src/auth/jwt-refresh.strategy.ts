import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AcUserService } from 'src/module/ac-user/ac-user.service';
import { Request } from 'express';
import { AcUser } from 'src/model/entity/acUser.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly acUserService: AcUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.acUserRefreshToken;
        },
      ]),
      secretOrKey: configService.get('AC_USER_JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: AcUser) {
    const refreshToken = request.cookies?.acUserRefreshToken;
    return this.acUserService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload,
    );
  }
}
