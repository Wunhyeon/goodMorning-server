import { forwardRef, Module } from '@nestjs/common';
import { AcUserService } from './ac-user.service';
import { AcUserController } from './ac-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcUser } from 'src/model/entity/acUser.entity';
import { constantString } from 'src/global/global.constants';
import { AuthModule } from 'src/auth/auth.module';
import { MasterUser } from 'src/model/entity/masterUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [AcUser, MasterUser],
      constantString.latticeConnection,
    ),
    // AuthModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [AcUserController],
  providers: [AcUserService],
  exports: [AcUserService],
})
export class AcUserModule {}
