import dataSource from 'lattice.a-type.dataSource';
import { AcTechKeyword } from '../entity/acTechKeyword.entity';

export const acTechKeywordRepository = dataSource
  .getRepository(AcTechKeyword)
  .extend({});
