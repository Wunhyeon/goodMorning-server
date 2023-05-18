import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { constantString } from 'src/global/global.constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcKeyword } from './acKeyword.entity';
import { AcStructure } from './acStructure.entity';
import { AcTech } from './acTech.entity';
import { AuthorityPolicy } from './authorityPolicy.entity';
import { MasterUser } from './masterUser.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'accelerator',
})
export class Accelerator {
  constructor() {}
  @ApiProperty({ example: 'afds-1245-zxcv', description: '액셀러레이터의 id' })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 1,
    description: '액셀러레이터의 타입. 1: AC, 2 : VC, 3: 기타',
  })
  @IsNumber()
  @Column('tinyint', { unsigned: true })
  type!: number;

  @ApiProperty({
    example: 'bluepoint.ac',
    description: '해당 ac의 도메인 주소',
  })
  @IsString()
  @Column()
  domain!: string;

  @ApiProperty({ example: '318-81-02422', description: '사업자번호' })
  @IsString()
  businessNumber!: string;

  @ApiProperty({ example: '12345-678', description: '법인등록번호' })
  registrationNumber!: string;

  @ApiProperty({ example: '이용관', description: 'CEO 이름' })
  ceoName!: string;

  @ApiProperty({ example: '2014-07-03', description: '설립일' })
  establishmentDate!: string;

  @ApiProperty({
    example:
      'https://bluebox-ac-prod.s3.ap-northeast-2.amazonaws.com/bbox/1/1393/companyImg/%E1%84%89%E1%85%B2%E1%84%85%E1%85%B3_list.jpg1675414761563.jpg',
    description: '로고 url',
  })
  logoUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @OneToMany(() => MasterUser, (masterUser) => masterUser.accelerator)
  masterUser!: MasterUser[];

  @OneToMany(() => AcStructure, (acStructure) => acStructure.accelerator)
  acStructure!: AcStructure[];

  @OneToMany(() => AcTech, (acTech) => acTech.accelerator)
  acTech!: AcTech[];

  @OneToMany(() => AcKeyword, (acKeyword) => acKeyword.accelerator)
  acKeyword!: AcKeyword[];
}
