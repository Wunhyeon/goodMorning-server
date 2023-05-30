import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectDataSource(constantString.morningeeConnection)
    private dataSource: DataSource,
  ) {}

  selectAll() {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder('acUser')
      .getMany();
  }
}
