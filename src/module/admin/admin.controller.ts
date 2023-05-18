import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { MasterLocalAuthGuard } from 'src/auth/master-local-auth.guard';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { MasterJwtRefreshAuthGuard } from 'src/auth/master-jwt-refresh-auth.guards';
import { MasterJwtAuthGuard } from 'src/auth/master-jwt-auth.guards';
import { CreateAcTechDto } from '../ac-tech/dto/create-acTech.dto';

@ApiTags('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '마스터 유저 로그인',
    description: '마스터 유저 로그인. 쿠키로 accessToken, refreshToken 반환',
  })
  // @ApiResponse({ status: 200, isArray: true, type: Portfolio })
  @UseGuards(MasterLocalAuthGuard)
  @Post('login')
  async masterUserLogin(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return this.authService.masterUserLogin(req.user);
    const accessTokenCookie =
      this.authService.masterGetCookieWithJwtAccessToken(req.user);
    const refreshTokenInfo =
      this.authService.masterGetCookieWithJwtRefreshToken(req.user);

    const refreshTokenCookie = refreshTokenInfo.cookie;
    const refreshToken = refreshTokenInfo.token;

    this.adminService.setCurrentRefreshToken(refreshToken, req.user);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    // return req.user;
    return;
  }

  // refresh Token으로 accessToken 재발행
  @UseGuards(MasterJwtRefreshAuthGuard)
  @Get('refresh')
  refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = this.authService.masterGetCookieWithJwtAccessToken(
      req.user,
    );

    res.setHeader('Set-Cookie', [accessToken]);
    return;
  }

  // accessToken 을 사용한 guard 예
  @UseGuards(MasterJwtAuthGuard)
  @Get()
  getInfo(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: '해당 ac의 전체 산업기술 조회',
    description: '해당 ac의 전체 산업기술 조회',
  })
  @UseGuards(MasterJwtAuthGuard)
  @Get('tech')
  async getTech() {
    // await this.adminService.createTech();
  }

  @ApiOperation({
    summary: '해당 ac의 산업기술 추가',
    description: '해당 ac의 산업기술 추가',
  })
  @UseGuards(MasterJwtAuthGuard)
  @Post('tech')
  createTech(@Body() createAcTechDto: CreateAcTechDto, @Req() req) {
    // this.adminService
    console.log('req.user : ', req.user);

    this.adminService.createTech(createAcTechDto, req.user.accelerator);
  }
}
