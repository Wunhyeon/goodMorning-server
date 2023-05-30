import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/entity/user.entity';
import { constantString } from 'src/global/global.constants';
import { AuthModule } from 'src/auth/auth.module';
import { MasterUser } from 'src/model/entity/masterUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, MasterUser],
      constantString.morningeeConnection,
    ),
    // AuthModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
