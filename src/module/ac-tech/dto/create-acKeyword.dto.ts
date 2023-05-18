import { ApiProperty, PickType } from '@nestjs/swagger';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';

export class CreateAcKeywordDto extends PickType(AcKeyword, ['name']) {
  @ApiProperty({ example: 'aaa' })
  id!: string;
}
