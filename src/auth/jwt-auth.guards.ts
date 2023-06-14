import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { errorString } from 'src/global/global.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // if (info instanceof JsonWebTokenError || info instanceof SyntaxError) {
    //   throw new UnauthorizedException(errorString.ACCESS_TOKEN_ERROR);
    // }

    if (info instanceof Error) {
      throw new UnauthorizedException(errorString.ACCESS_TOKEN_ERROR);
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
