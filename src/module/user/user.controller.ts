import {
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  forwardRef,
  Get,
  Res,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtRefreshAuthGuard } from 'src/auth/jwt-refresh-auth.guards';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async userLogin(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
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

    this.userService.setCurrentRefreshToken(refreshToken, req.user);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    console.log('req.user : ', req.user);

    // return req.user;
    return { user: { name: req.user.name, nickName: req.user.nickName } };
  }

  // refresh Token으로 accessToken 재발행
  // @UseGuards(AuthGuard('jwt-refresh-token'))
  @UseGuards(JwtRefreshAuthGuard)
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

  @ApiOperation({
    summary: '유저 비밀번호 변경',
    description:
      '유저 비밀번호 변경. 비밀번호를 변경하고 난 후에, 쿠키를 없애기 때문에 다시 로그인 시키는 게 필요합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('pw')
  async updatePassword(
    @Request() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Res() res,
  ) {
    await this.userService.updatePassword(
      req.user.id,
      updateUserPasswordDto.password,
    );

    res.clearCookie('acUserAccessToken');
    res.clearCookie('acUserRefreshToken');
    res.send();
  }
}
