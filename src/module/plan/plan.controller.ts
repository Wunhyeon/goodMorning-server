import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { CreatePlanDto } from './dto/create-plan.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('PLAN')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // plan 입력
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('today/mine')
  async getTodayMyPlan(@Request() req) {
    return await this.planService.getTodayMyPlan(req.user.id);
  }

  // 내 계획 히스토리 목록
  @ApiOperation({
    summary: '내 계획 히스토리',
    description:
      '내 계획 히스토리. ex)2023-05-30T15:00:00.000Z ~ 2023-06-01T15:00:00.000Z  \n 이 시간을 KTC로 바꿔보면 5월31일00시00분 ~ 6월 2일00시00분 사이의 시간 안에 있는 계획을 가져오게 됩니다. (6월 2일은 미포함)',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 9,
          contents: {
            plan: '수정수정~~~ 5월 31일 5월 31일 5월 31일 5월 31일 수정수정수정',
          },
          creationTime: '2023-05-30T22:00:01.000Z',
          isSuccess: 1,
          createdAt: '2023-05-31T15:47:34.734Z',
        },
        {
          id: 12,
          contents: {
            plan: '6월 1일 222222',
          },
          creationTime: '2023-06-01T01:15:00.000Z',
          isSuccess: 3,
          createdAt: '2023-06-01T13:33:07.936Z',
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/history/mine')
  async getMyPlanHistory(
    @Request() req,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    return await this.planService.getPlanFromStartTimeToEndTime(
      startTimeDate,
      endTimeDate,
      req.user.id,
    );
  }

  // 오늘 쓴 계획 수정하기
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('today/mine')
  async updateTodayMyPlan(
    @Request() req,
    @Body() createPlanDto: CreatePlanDto,
  ) {
    await this.planService.updateTodayMyPlan(req.user.id, createPlanDto);
  }

  // 내 오늘 계획삭제
  @ApiOperation({
    summary: '오늘 내가 쓴 계획 삭제',
    description:
      '오늘(목표시간 범위 내. ex.7시~ 다음날 7시 범위 내) 내가 쓴 계획을 삭제합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':planId')
  async deleteLoginUserPlan(
    @Request() req,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    await this.planService.softDeleteTodayMyPlan(req.user.id, planId);
  }
}
