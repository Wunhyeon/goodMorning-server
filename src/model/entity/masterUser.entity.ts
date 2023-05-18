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
import { AuthorityPolicy } from './authorityPolicy.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'master_user',
})
export class MasterUser {
  constructor() {}
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Accelerator, (accelerator) => accelerator.masterUser, {
    nullable: false,
  })
  @JoinColumn({ name: 'ac_id' })
  accelerator: Accelerator;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ length: 30 })
  name!: string;

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;

  // @OneToMany(() => AuthorityPolicy, (authorityPolicy) => authorityPolicy.acUser)
  // authorityPolicy?: AuthorityPolicy[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
