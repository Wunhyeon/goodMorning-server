import { constantString } from 'src/global/global.constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from './plan.entity';
import { UserJob } from './userJob.entity';

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

  @ApiProperty({ example: 'email', description: 'xhwogusxh@gmail.com' })
  @IsString() // validator
  @Unique('uq_email', ['email'])
  @Column()
  email!: string;

  @ApiProperty({ example: 'asdnkvl', description: '유저 비밀번호' })
  @IsString()
  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  nickName!: string;

  // 생년월일
  @Column({ nullable: true })
  birthday?: Date;

  // 결심
  @Column({ nullable: true })
  decision?: string;

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

  @OneToMany(() => UserJob, (userJob) => userJob.user)
  userJob?: UserJob[];
}
