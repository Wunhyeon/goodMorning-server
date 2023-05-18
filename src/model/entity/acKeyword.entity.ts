import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
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
import { Accelerator } from './accelerator.entity';
import { AcTechKeyword } from './acTechKeyword.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'ac_keyword',
})
export class AcKeyword {
  constructor(id?: string) {
    if (id) {
      this.id = id;
    }
  }
  @ApiProperty({
    example: 'afds-1245-zxcv',
    description: 'acKeyword(키워드)의 id',
  })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Accelerator, (accelerator) => accelerator.acKeyword)
  @JoinColumn({ name: 'ac_id' })
  accelerator!: Accelerator;

  @ApiProperty({ example: '추천 키워드 1', description: '키워드' })
  @IsString()
  @Column({ unique: true })
  name!: string;

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

  @OneToMany(() => AcTechKeyword, (acTechKeyword) => acTechKeyword.acKeyword)
  acTechKeyword?: AcTechKeyword[];
}
