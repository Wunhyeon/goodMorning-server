import { ApiProperty } from '@nestjs/swagger';
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

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'ac_structure',
})
@Index('name_deleted', ['name', 'deleted'], { unique: true })
export class AcStructure {
  constructor(id?: string) {
    if (id) {
      this.id = id;
    }
  }

  @ApiProperty({
    example: 'afds-1245-zxcv',
    description: '액셀러레이터 조직 id',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'qwtr-1254-zxvc', description: '속한 엑셀러레이터' })
  @ManyToOne(() => Accelerator, (accelerator) => accelerator.acStructure, {
    nullable: false,
  })
  @JoinColumn({ name: 'ac_id' })
  accelerator!: Accelerator;

  @ApiProperty({ example: 'IT기획개발팀', description: '조직 이름' })
  @Column()
  name!: string;

  @ApiProperty({ description: '조직 인덱스' })
  @Column()
  structureIndex!: number;

  //자기참조
  @ApiProperty({ example: '부모 조직', description: '경영기획본부' })
  @ManyToOne(() => AcStructure, (acStructure) => acStructure.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: AcStructure;

  @ApiProperty({ description: '자식조직들' })
  @OneToMany(() => AcStructure, (acStructure) => acStructure.id)
  child!: AcStructure[];

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
}
