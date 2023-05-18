// import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcKeyword } from '../model/entity/acKeyword.entity';

import { AcStructure } from '../model/entity/acStructure.entity';
import { AcTech } from '../model/entity/acTech.entity';
import { AcTechKeyword } from '../model/entity/acTechKeyword.entity';
import { AcUser } from '../model/entity/acUser.entity';
import { Accelerator } from '../model/entity/accelerator.entity';
import { AuthorityPolicy } from '../model/entity/authorityPolicy.entity';
import { MasterUser } from '../model/entity/masterUser.entity';
import { Plan } from '../model/entity/plan.entity';
import { Portfolio } from '../model/entity/portfolio.entity';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';

export const entities = [
  Portfolio,
  AcUser,
  AuthorityPolicy,
  MasterUser,
  AcStructure,
  Accelerator,
  AcTech,
  AcKeyword,
  AcTechKeyword,
  Plan,
];
