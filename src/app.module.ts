import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './module/portfolio/portfolio.module';
import { GlobalModule } from './global/global.module';
import { UtilModule } from './util/util.module';
import { AcceleratorModule } from './module/accelerator/accelerator.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { AcUserModule } from './module/ac-user/ac-user.module';
import { AdminModule } from './module/admin/admin.module';
import { AcTechModule } from './module/ac-tech/ac-tech.module';
import { PlanModule } from './module/plan/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // RedisModule.forRootAsync({
    //   useFactory: () => ({
    //     config: {
    //       url: 'redis://127.0.0.1:6379',
    //     },
    //   }),
    // }),

    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          // host:   'redis-server', // docker-compose에 써준 redis 이미지 이름
          host:
            process.env.NODE_ENV === 'prod'
              ? 'redis-server'
              : 'redis-server-dev',
          port: 6379, // redis 기본 port
        },
      }),
    }),
    GlobalModule,
    UtilModule,
    PortfolioModule,
    AcceleratorModule,
    AuthModule,
    AcUserModule,
    AdminModule,
    AcTechModule,
    PlanModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // interceptor 사용예
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
