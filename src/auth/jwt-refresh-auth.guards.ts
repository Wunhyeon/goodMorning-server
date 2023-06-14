import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { errorString } from 'src/global/global.constants';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // if (
    //   info instanceof JsonWebTokenError ||
    //   info instanceof SyntaxError /*JWT 문법이 잘 못 됬을 때 */
    // ) {
    //   throw new UnauthorizedException(errorString.REFRESH_TOKEN_ERROR);
    // }

    if (info instanceof Error) {
      throw new UnauthorizedException(errorString.REFRESH_TOKEN_ERROR);
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
