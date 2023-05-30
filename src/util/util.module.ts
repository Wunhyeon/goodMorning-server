import { Module } from '@nestjs/common';
import { HashUtil } from './hash.util';
import { RedisUtil } from './redis.util';
import { Util } from './util';

@Module({
  providers: [RedisUtil, HashUtil, Util],
  exports: [RedisUtil, HashUtil, Util],
})
export class UtilModule {}
