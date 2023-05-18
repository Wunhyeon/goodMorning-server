export class SetRedisTestDto {
  key: string;

  value: string;

  option?: 'EX' | 'PX' | 'EXAT' | 'PXAT' | 'NX' | 'XX' | 'KEEPTTL' | 'GET';

  time?: number;
}
