import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { constantString } from 'src/global/global.constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'portfolio',
})
export class Portfolio {
  constructor() {}

  @ApiProperty({ example: 'asdfsadf', description: 'uuid로 생성된 id' }) // swagger 예시
  @IsUUID() //validator
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '아론비행선박', description: '포트폴리오 회사 이름' })
  @IsString() // validator
  @IsNotEmpty() // validator
  @Column()
  companyName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
