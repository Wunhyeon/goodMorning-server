import dataSource from 'morningee.dataSource';
import { InsertResult } from 'typeorm';
import { MasterUser } from '../entity/masterUser.entity';

export const masterUserRepository = dataSource
  .getRepository(MasterUser)
  .extend({
    async selectMasterUserByEmail(
      email: string,
    ): Promise<MasterUser> | undefined {
      return this.createQueryBuilder('masterUser')
        .innerJoin('masterUser.accelerator', 'accelerator')
        .select([
          'masterUser.id',
          'masterUser.email',
          'masterUser.name',
          'masterUser.password',
          'masterUser.currentHashedRefreshToken',
          'accelerator.id',
        ])
        .where('masterUser.email = :email', { email })
        .getOne();
    },
  });
