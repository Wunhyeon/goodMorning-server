import { Module } from '@nestjs/common';
import { GlobalModule } from 'src/global/global.module';
import { AcUserRepository } from './acUser.repository';
import { PortfolioRepository } from './portfolio.repository';

@Module({
  imports: [GlobalModule],
  controllers: [],
  providers: [PortfolioRepository, AcUserRepository],
  exports: [PortfolioRepository, AcUserRepository],
})
export class RepositoryModule {}
