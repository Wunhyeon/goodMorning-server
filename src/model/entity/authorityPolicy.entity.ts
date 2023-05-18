import { constantString } from 'src/global/global.constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AcUser } from './acUser.entity';

@Entity({
  database: process.env.DB_LATTICE_DATABASE,
  schema: process.env.DB_LATTICE_DATABASE,
  name: 'authority_policy',
})
export class AuthorityPolicy {
  constructor() {}
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => AcUser, (acUser) => acUser.authorityPolicy)
  acUser!: AcUser;
}
