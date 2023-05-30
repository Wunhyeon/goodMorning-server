import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/model/entity/plan.entity';
import { constantString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, User], constantString.morningeeConnection),
    UtilModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
