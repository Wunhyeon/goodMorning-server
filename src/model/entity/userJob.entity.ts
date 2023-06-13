import { constantString } from 'src/global/global.constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from './plan.entity';
import { User } from './user.entity';
import { Job } from './job.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'user_job',
})
export class UserJob {
  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }
  @ApiProperty({ example: 1, description: 'id' }) // swagger 예시
  @IsNumber()
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_user' })
  user!: User;

  @ManyToOne(() => Job, (job) => job.id, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'fk_job' })
  job!: Job;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
