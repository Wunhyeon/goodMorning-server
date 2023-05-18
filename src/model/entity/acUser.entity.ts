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
import { AuthorityPolicy } from './authorityPolicy.entity';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from './plan.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'ac_user',
})
export class AcUser {
  constructor() {}
  @ApiProperty({ example: 'asdfsadf', description: 'uuid로 생성된 id' }) // swagger 예시
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '아론비행선박', description: '포트폴리오 회사 이름' })
  @IsString() // validator
  @Column()
  email!: string;

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

  @OneToMany(() => AuthorityPolicy, (authorityPolicy) => authorityPolicy.acUser)
  authorityPolicy?: AuthorityPolicy[];

  @OneToMany(() => Plan, (plan) => plan.acUser)
  plan?: Plan[];
}
