// import { Repository } from 'typeorm';
// import { AcTech } from '../entity/acTech.entity';
// import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, InsertResult } from 'typeorm';
import { AcTech } from '../entity/acTech.entity';
import dataSource from 'lattice.a-type.dataSource';
import { AcTechKeyword } from '../entity/acTechKeyword.entity';
import { Accelerator } from '../entity/accelerator.entity';

// export class AcTechRepository extends Repository<AcTech> {
//   constructor(
//     @InjectRepository(AcTech)
//     private acTechRepository: Repository<AcTech>,
//   ) {
//     super(
//       acTechRepository.target,
//       acTechRepository.manager,
//       acTechRepository.queryRunner,
//     );
//   }

//   // sample method for demo purpose
//   // async insertAcTech(name : string){
//   //     return await this.acTechRepository.createQueryBuilder
//   // }
// }

export const acTechRepository = dataSource.getRepository(AcTech).extend({
  async findByName(name: string): Promise<AcTech[]> {
    return this.createQueryBuilder('acTech').getMany();
  },
  async ohyes(): Promise<AcTech[]> {
    return this.createQueryBuilder('acTech')
      .innerJoin('acTech.acTechKeyword', 'acTechKeyword')
      .innerJoin('acTechKeyword.acKeyword', 'acKeyword')
      .select([
        'acTech.id',
        'acTech.name',
        'acTechKeyword.acKeywordId',
        'acKeyword.id',
        'acKeyword.name',
      ])
      .getMany();
  },
  async insertTech(
    accelerator: Accelerator,
    name: string,
    description?: string,
    isActive?: boolean,
    order?: number,
  ): Promise<InsertResult> {
    return this.createQueryBuilder('acTech')
      .insert()
      .into(AcTech)
      .values({
        name,
        accelerator,
        description,
        isActive,
        order,
      })
      .execute();
  },
});
