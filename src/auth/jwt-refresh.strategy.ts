import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/module/user/user.service';
import { Request } from 'express';
import { User } from 'src/model/entity/user.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly acUserService: UserService,
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

  async validate(request: Request, payload: User) {
    const refreshToken = request.cookies?.acUserRefreshToken;
    return this.acUserService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload,
    );
  }
}
