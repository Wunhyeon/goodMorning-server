import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Portfolio } from 'src/model/entity/portfolio.entity';
import { SetRedisTestDto } from 'src/util/dto/set-redis-test.dto';
import { RedisUtil } from 'src/util/redis.util';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('PORTFOLIO')
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly redisUtil: RedisUtil,
  ) {}

  // 예시
  @ApiOperation({
    summary: '전체 포트폴리오 조회',
    description: '전체 포트폴리오를 조회합니다.',
  })
  @ApiResponse({ status: 200, isArray: true, type: Portfolio })
  @Get()
  getAllPortfolio() {
    return this.portfolioService.getAll();
  }

  @ApiOperation({
    summary: '포트폴리오 생성',
    description: '포트폴리오를 생성합니다.',
  })
  @Post()
  async createPortfolio(@Body() createPortfolioDto: CreatePortfolioDto) {
    await this.portfolioService.createPortfolio(createPortfolioDto);
  }

  // redis 사용예시
  @Post('redis')
  async setRedisTest(@Body() setRedisTestDto: SetRedisTestDto) {
    await this.redisUtil.set(
      setRedisTestDto.key,
      setRedisTestDto.value,
      setRedisTestDto.option,
      setRedisTestDto.time,
    );
  }

  @Get('redis')
  async getRedis(@Query('key') key: string) {
    return await this.redisUtil.get(key);
  }
}
