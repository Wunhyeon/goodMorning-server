import { PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcTech } from 'src/model/entity/acTech.entity';
import { CreateAcKeywordDto } from './create-acKeyword.dto';

export class CreateAcTechDto extends PickType(AcTech, [
  'name',
  'description',
  'isActive',
  'order',
]) {
  @ApiProperty({ type: [CreateAcKeywordDto] })
  acKeyword: CreateAcKeywordDto[];
}
