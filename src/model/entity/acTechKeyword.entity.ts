import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AcKeyword } from './acKeyword.entity';
import { AcTech } from './acTech.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'ac_tech_keyword',
})
@Index('acTechId_acKeywordId_deleted', ['acTechId', 'acKeywordId', 'deleted'], {
  unique: true,
})
export class AcTechKeyword {
  // @PrimaryGeneratedColumn('uuid')
  // id!: string;

  @Column({ nullable: false })
  acTechId!: string;

  @ManyToOne(() => AcTech, (acTech) => acTech.acTechKeyword)
  acTech!: AcTech;

  @PrimaryColumn({ nullable: false })
  acKeywordId!: string;

  @ManyToOne(() => AcKeyword, (acKeyword) => acKeyword.acTechKeyword)
  acKeyword!: AcKeyword;

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
