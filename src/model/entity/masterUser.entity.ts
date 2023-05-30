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

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'master_user',
})
export class MasterUser {
  constructor() {}
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
