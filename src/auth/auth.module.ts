import { forwardRef, Module } from '@nestjs/common';
import { AcUserModule } from 'src/module/ac-user/ac-user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { MasterLocalStrategy } from './master-local.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy';
import { AdminModule } from 'src/module/admin/admin.module';
import { UtilModule } from 'src/util/util.module';
import { MasterJwtStrategy } from './master-jwt.strategy';
import { MasterJwtRefreshTokenStrategy } from './master-jwt-refresh.strategy';
@Module({
  imports: [
    // AcUserModule,
    PassportModule,
    // JwtModule.register({
    //   secret: process.env.AC_USER_JWT_SECRET,
    //   signOptions: { expiresIn: '60s' },
    // }),

    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secret: config.get('AC_USER_JWT_ACCESS_SECRET'),
    //     signOptions: { expiresIn: '60s' },
    //   }),
    // }),
    JwtModule,

    forwardRef(() => AdminModule),
    forwardRef(() => AcUserModule),
    UtilModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    MasterLocalStrategy,
    JwtRefreshTokenStrategy,
    MasterJwtStrategy,
    MasterJwtRefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
