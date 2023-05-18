import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisUtil {
  constructor(
    @InjectRedis()
    private readonly redisClient: Redis,
  ) {}

  async get(key) {
    return await this.redisClient.get(key);
  }

  async set(
    key,
    value,
    option?:
      | 'EX'
      | 'PX'
      | 'EXAT'
      | 'PXAT'
      | 'NX'
      | 'XX'
      | 'KEEPTTL'
      | 'GET'
      | undefined,
    time?: number,
  ) {
    /* 
    REDIS SET OPTION
        EX seconds -- Set the specified expire time, in seconds.
        PX milliseconds -- Set the specified expire time, in milliseconds.
        EXAT timestamp-seconds -- Set the specified Unix time at which the key will expire, in seconds.
        PXAT timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds.
        NX -- Only set the key if it does not already exist.
        XX -- Only set the key if it already exist.
        KEEPTTL -- Retain the time to live associated with the key.
        GET -- Return the old string stored at key, or nil if key did not exist. An error is returned and SET aborted if the value stored at key is not a string.
    */

    // return await this.redisClient.set(
    //   key,
    //   value,
    //   option ? option : undefined,
    //   time ? time : undefined,
    // );
    return await this.redisClient.set(key, value, 'EX', 86400);
  }

  async del(key) {
    await this.redisClient.del(key);
  }
}
