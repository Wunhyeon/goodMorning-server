import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcUser } from './acUser.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'plan',
})
export class Plan {
  constructor() {}
  @ApiProperty({ example: 'asdfsadf', description: 'uuid로 생성된 id' }) // swagger 예시
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => AcUser, (acUser) => acUser.plan)
  acUser!: AcUser;

  // 계획
  @Column('json')
  contents!: JSON;

  // 작성시간 (프론트)
  @Column()
  creationTime!: Date;

  // 성공여부
  @Column('boolean')
  isSuccess!: 1 | 2 | 3;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
