import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PLAN')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // plan 입력
  @UseGuards(JwtAuthGuard)
  @Post()
  async insertPlan(@Request() req, @Body() createPlanDto: CreatePlanDto) {
    console.log('req.user : ', req.user);
    console.log('createPlan : ', createPlanDto);

    await this.planService.insertPlan(req.user, createPlanDto);
  }

  // plan 조회. (그날 다른사람들꺼. 다음 plan올리는 시간 전까지.)
  @UseGuards(JwtAuthGuard)
  @Get('today/allUser')
  async getThisTimePlan() {
    return await this.planService.getAllUserThisTimePlan();
  }
}
