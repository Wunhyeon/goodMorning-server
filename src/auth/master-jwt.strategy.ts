import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { MasterUser } from 'src/model/entity/masterUser.entity';

@Injectable()
export class MasterJwtStrategy extends PassportStrategy(
  Strategy,
  'master-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.masterUserAccessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.MASTER_USER_JWT_ACCESS_SECRET,
      usernameField: 'email',
      passwordFiled: 'password',
    });
  }

  async validate(payload: MasterUser) {
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
