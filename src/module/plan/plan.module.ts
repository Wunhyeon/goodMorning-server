import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/model/entity/plan.entity';
import { constantString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, User], constantString.morningeeConnection),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
