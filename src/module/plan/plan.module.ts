import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/model/entity/plan.entity';
import { constantString } from 'src/global/global.constants';
import { AcUser } from 'src/model/entity/acUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan, AcUser], constantString.latticeConnection),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
