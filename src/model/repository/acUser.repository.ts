import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { DataSource } from 'typeorm';
import { AcUser } from '../entity/acUser.entity';
import { Portfolio } from '../entity/portfolio.entity';

@Injectable()
export class AcUserRepository {
  constructor(
    @InjectDataSource(constantString.latticeConnection)
    private dataSource: DataSource,
  ) {}

  selectAll() {
    return this.dataSource
      .getRepository(AcUser)
      .createQueryBuilder('acUser')
      .getMany();
  }
}
