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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('PLAN')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // plan 입력
  @UseGuards(JwtAuthGuard)
  @Post()
  async insertPlan(@Request() req, @Body() createPlanDto: CreatePlanDto) {
    await this.planService.insertPlan(req.user, createPlanDto);
  }

  // plan 조회. (그날 다른사람들꺼. 다음 plan올리는 시간 전까지.)
  // @UseGuards(JwtAuthGuard)
  @Get('today/allUser')
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          email: 'xhwogusxh@gmail.com',
          name: '임재현',
          plan: [
            {
              id: 2,
              contents: {
                JSON: 'JSON',
              },
              creationTime: '2023-05-30T16:15:00.000Z',
            },
          ],
        },
      ],
    },
  })
  async getThisTimePlan() {
    return await this.planService.getAllUserThisTimePlan2();
  }
}
