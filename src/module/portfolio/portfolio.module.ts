import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { RepositoryModule } from 'src/model/repository/repository.module';
import { UtilModule } from 'src/util/util.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from 'src/model/entity/portfolio.entity';
import { constantString } from 'src/global/global.constants';

@Module({
  imports: [
    RepositoryModule,
    UtilModule,
    TypeOrmModule.forFeature([Portfolio], constantString.latticeConnection),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
