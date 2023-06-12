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
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from './plan.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'user',
})
export class User {
  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }
  @ApiProperty({ example: 1, description: 'id' }) // swagger 예시
  @IsNumber()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: '아론비행선박', description: '포트폴리오 회사 이름' })
  @IsString() // validator
  @Column()
  email!: string;

  @ApiProperty({ example: 'asdnkvl', description: '유저 비밀번호' })
  @IsString()
  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @OneToMany(() => Plan, (plan) => plan.user)
  plan?: Plan[];
}
