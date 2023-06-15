import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('COMMON')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @ApiOperation({ summary: '모든 직업 조회', description: '모든 직업 조회' })
  @Get('job')
  async getAllJob() {
    return await this.commonService.getAllJob();
  }
}
