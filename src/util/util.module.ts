import { Module } from '@nestjs/common';
import { HashUtil } from './hash.util';
import { RedisUtil } from './redis.util';

@Module({
  providers: [RedisUtil, HashUtil],
  exports: [RedisUtil, HashUtil],
})
export class UtilModule {}
