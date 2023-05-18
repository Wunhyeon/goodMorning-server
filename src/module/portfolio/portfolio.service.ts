import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { Portfolio } from 'src/model/entity/portfolio.entity';
import { AcUserRepository } from 'src/model/repository/acUser.repository';
import { PortfolioRepository } from 'src/model/repository/portfolio.repository';
import { DataSource, Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly portfolioCustomRepository: PortfolioRepository, // custom으로 만들어본 repository
    @InjectRepository(Portfolio, constantString.latticeConnection)
    private portfolioRepository: Repository<Portfolio>, // nestjs 공식 문서에 나와있는 repository pattern
    private readonly acUserRepository: AcUserRepository,
    @InjectDataSource(constantString.latticeConnection)
    private dataSource: DataSource,
  ) {}

  async getAll() {
    // throw new Error('testest');
    // throw new ForbiddenException();

    // customRepository 사용
    // return await this.portfolioCustomRepository.selectAll();

    // 공식문서에 나와있는 버젼으로 createQueryBuilder 사용
    // return await this.portfolioRepository
    //   .createQueryBuilder('portfolio')
    //   .getMany();

    // 찐 공식문서에 나와있는 내용
    return await this.portfolioRepository.find();
  }

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    // return await this.portfolioRepository.createOne();

    return await this.portfolioRepository.insert(createPortfolioDto);
  }

  // transaction test용
  async insert2() {
    await this.dataSource.transaction(async (manager) => {
      // manager.withRepository(PortfolioRepository);
    });
  }
}
