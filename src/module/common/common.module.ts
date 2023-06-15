import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/model/entity/job.entity';
import { constantString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, User], constantString.morningeeConnection),
    UtilModule,
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
