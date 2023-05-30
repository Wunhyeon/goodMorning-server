import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/model/entity/user.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.acUserAccessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.AC_USER_JWT_ACCESS_SECRET,
      usernameField: 'email',
      passwordFiled: 'password',
    });
  }

  async validate(payload: User) {
    return {
      id: payload.id,
      email: payload.email,
      // authorityPolicy: payload.authorityPolicy,
    };
  }
}
