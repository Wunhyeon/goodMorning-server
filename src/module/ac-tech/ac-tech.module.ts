import { Module } from '@nestjs/common';
import { AcTechService } from './ac-tech.service';
import { AcTechController } from './ac-tech.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcTech } from 'src/model/entity/acTech.entity';
import { constantString } from 'src/global/global.constants';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcTechKeyword } from 'src/model/entity/acTechKeyword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [AcTech, AcKeyword, AcTechKeyword],
      constantString.latticeConnection,
    ),
  ],
  controllers: [AcTechController],
  providers: [AcTechService],
  exports: [AcTechService],
})
export class AcTechModule {}
