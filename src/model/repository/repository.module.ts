import { Module } from '@nestjs/common';
import { GlobalModule } from 'src/global/global.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [GlobalModule],
  controllers: [],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
