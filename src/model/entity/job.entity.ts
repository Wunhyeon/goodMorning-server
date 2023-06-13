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
import { UserJob } from './userJob.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'job',
})
export class Job {
  constructor(id?: number) {
    if (id) {
      this.id = id;
    }
  }
  @ApiProperty({ example: 1, description: 'id' }) // swagger 예시
  @IsNumber()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: '대학생', description: '직업 이름' })
  @IsString() // validator
  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  //자기참조
  @ManyToOne(() => Job, (job) => job.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id', foreignKeyConstraintName: 'fk_parent' })
  parent!: Job;

  @OneToMany(() => Job, (job) => job.id)
  child!: Job[];

  @OneToMany(() => UserJob, (userJob) => userJob.job)
  userJob?: UserJob[];
}
