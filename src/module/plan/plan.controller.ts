import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Patch,
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

  // 오늘 내가 쓴 계획 조회
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 4,
        contents: {
          plan: '테이블 정리(유유아이디 말고 넘버로)\n오늘 내가 쓴 계획 확인하기\n내 한달(30일)작성기록 보기\n생각하기',
        },
        creationTime: '2023-05-30T00:56:00.000Z',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('today/mine')
  async getTodayMyPlan(@Request() req) {
    return await this.planService.getTodayMyPlan(req.user.id);
  }

  // 오늘 쓴 계획 수정하기
  @UseGuards(JwtAuthGuard)
  @Patch('today/mine')
  async updateTodayMyPlan(
    @Request() req,
    @Body() createPlanDto: CreatePlanDto,
  ) {
    this.planService.updateTodayMyPlan(req.user.id, createPlanDto);
  }
}
