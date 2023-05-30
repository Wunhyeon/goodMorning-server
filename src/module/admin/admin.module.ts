import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { constantString } from 'src/global/global.constants';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MasterUser], constantString.morningeeConnection),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
