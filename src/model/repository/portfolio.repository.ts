import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { DataSource } from 'typeorm';
import { Portfolio } from '../entity/portfolio.entity';

@Injectable()
export class PortfolioRepository {
  constructor(
    @InjectDataSource(constantString.latticeConnection)
    private dataSource: DataSource,
  ) {}

  selectAll() {
    return this.dataSource
      .getRepository(Portfolio)
      .createQueryBuilder('portfolio')
      .getMany();
  }
}
