import { PickType } from '@nestjs/swagger';
import { Plan } from 'src/model/entity/plan.entity';

export class CreatePlanDto extends PickType(Plan, [
  'contents',
  'creationTime',
]) {}
