import {
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  forwardRef,
  Get,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(
    private readonly acUserService: UserService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async userLogin(@Request() req, @Res({ passthrough: true }) res: Response) {
    // return req.user;
    // return this.authService.acUserlogin(req.user);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user,
    );
    const refreshTokenInfo = this.authService.getCookieWithJwtRefreshToken(
      req.user,
    );

    const refreshTokenCookie = refreshTokenInfo.cookie;
    const refreshToken = refreshTokenInfo.token;

    this.acUserService.setCurrentRefreshToken(refreshToken, req.user);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    console.log('req.user : ', req.user);

    // return req.user;
    return { user: { name: req.user.name } };
  }

  // refresh Token으로 accessToken 재발행
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('refresh')
  refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.getCookieWithJwtAccessToken(req.user);

    res.setHeader('Set-Cookie', [accessToken]);
    return;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
