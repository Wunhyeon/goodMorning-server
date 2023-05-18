import dataSource from 'lattice.a-type.dataSource';
import { AcKeyword } from '../entity/acKeyword.entity';
import { InsertResult } from 'typeorm';
import { Accelerator } from '../entity/accelerator.entity';

export const acKeywordRepository = dataSource.getRepository(AcKeyword).extend({
  /**
   * {name : string}[]로 acKeyword Insert
   * @param nameArr : {name : string}[]
   * @returns
   */
  insertKeywordArr(nameArr: { name: string }[]): Promise<InsertResult> {
    return this.createQueryBuilder('acKeyword')
      .insert()
      .into(AcKeyword)
      .values(nameArr)
      .execute();
  },
  /**
   * acKeyword INSERT
   * @param name : string
   * @param accelerator : Accelerator
   * @returns
   */
  insertName(name: string, accelerator: Accelerator): Promise<InsertResult> {
    return this.createQueryBuilder('acKeyword')
      .insert()
      .into(AcKeyword)
      .values({ name, accelerator })
      .execute();
  },
});
