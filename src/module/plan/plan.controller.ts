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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiOperation({
    summary: '오늘 다른사람들 꺼 조회',
    description:
      '오늘 다른사람들 꺼 조회. isSuccess 1 : 성공, isSuccess 2 : 반절 성공, isSuccess 3 : 실패',
  })
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
              isSuccess: 3,
            },
          ],
        },
      ],
    },
  })
  async getThisTimePlan() {
    return await this.planService.getAllUserThisTimePlan2();
  }

  @ApiOperation({
    summary: '오늘 다른사람들 계획 조회 (내 계획 빼고)',
    description: '오늘 다른사람들 계획 조회 (내 계획 빼고)',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 2,
          email: 'others@gmail.com',
          name: '다른사람',
          plan: [
            {
              id: 2,
              contents: {
                JSON: 'JSON',
              },
              creationTime: '2023-05-30T16:15:00.000Z',
              isSuccess: 3,
            },
          ],
        },
      ],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('today/others')
  async getTodayOthersPlan(@Request() req) {
    return await this.planService.getTodayOthersPlan(req.user.id);
  }

  // 오늘 내가 쓴 계획 조회
  @ApiOperation({
    summary: '내가 오늘 쓴 계획 조회',
    description:
      '내가 오늘 쓴 계획 조회. isSuccess 1 : 성공, isSuccess 2 : 반절 성공, isSuccess 3 : 실패',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 4,
        contents: {
          plan: '테이블 정리(유유아이디 말고 넘버로)\n오늘 내가 쓴 계획 확인하기\n내 한달(30일)작성기록 보기\n생각하기',
        },
        creationTime: '2023-05-30T00:56:00.000Z',
        isSuccess: 2,
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
