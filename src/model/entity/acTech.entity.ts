import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accelerator } from './accelerator.entity';
import { AcTechKeyword } from './acTechKeyword.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'ac_tech',
})
@Index('name_deleted', ['name', 'deleted'], { unique: true })
@Index('ac_order', ['accelerator', 'order', 'deleted'], { unique: true })
export class AcTech {
  constructor(id?: string) {
    if (id) {
      this.id = id;
    }
  }
  @ApiProperty({
    example: 'afds-1245-zxcv',
    description: 'acTech(산업기술분류)의 id',
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Accelerator, (accelerator) => accelerator.acTech, {
    nullable: false,
  })
  @JoinColumn({ name: 'ac_id' })
  accelerator!: Accelerator;

  @ApiProperty({ example: 'Bio/Healthcard', description: '산업기술분류 이름' })
  @IsString()
  @IsNotEmpty()
  @Column()
  name!: string;

  @ApiProperty({
    example: '바이오 헬스케어란 건강관련...',
    description: '산업기술분류에 대한 설명',
  })
  @IsString()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: true, description: '산업기술 사용중/비사용중' })
  @IsBoolean()
  @Column({ default: true })
  isActive!: boolean;

  @ApiProperty({ example: 1, description: '산업기술분류 순서' })
  @IsNumber()
  @IsOptional()
  @Column({ nullable: true })
  order!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Column({
    asExpression: 'IF(deleted_at IS NULL, 0, NULL)',
    generatedType: 'VIRTUAL',
    nullable: true,
  })
  deleted!: boolean;

  @OneToMany(() => AcTechKeyword, (acTechKeyword) => acTechKeyword.acTech)
  acTechKeyword?: AcTechKeyword[];
}
