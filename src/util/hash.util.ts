import { Injectable } from '@nestjs/common';
import { pbkdf2Sync } from 'crypto';

@Injectable()
export class HashUtil {
  constructor() {}
  /**
   * 해쉬값을 만드는 함수.
   * @target 해쉬로 만들 스트링
   */
  makeHash(target: string) {
    const hashed = pbkdf2Sync(
      target,
      process.env.HASH_KEY as string,
      3,
      64,
      'sha256',
    );

    return hashed.toString('base64');
  }
}
