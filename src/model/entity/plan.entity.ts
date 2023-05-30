import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsDateString } from 'class-validator';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'plan',
})
export class Plan {
  constructor() {}
  @ApiProperty({ example: 1, description: 'id' }) // swagger 예시
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.plan)
  user!: User;

  // 계획
  @ApiProperty({
    example: { contents: 'contents' },
    description: '계획내용 JSON',
  })
  @Column('json')
  contents!: JSON;

  // 작성시간 (프론트)
  @ApiProperty({ example: '2023-05-30 04:29' })
  @IsDateString()
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
