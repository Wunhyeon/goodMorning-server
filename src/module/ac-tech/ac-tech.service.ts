import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcTech } from 'src/model/entity/acTech.entity';
import { AcTechKeyword } from 'src/model/entity/acTechKeyword.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAcTechDto } from './dto/create-acTech.dto';

@Injectable()
export class AcTechService {
  constructor(
    @InjectDataSource(constantString.latticeConnection)
    private dataSource: DataSource,
    // @InjectRepository(AcTech, constantString.latticeConnection)
    // private acTechRepository: Repository<AcTech>,
    @InjectRepository(AcKeyword, constantString.latticeConnection)
    private acKeywordRepository: Repository<AcKeyword>,
    @InjectRepository(AcTechKeyword, constantString.latticeConnection)
    private acTechKeywordRepository: Repository<AcTechKeyword>,
  ) {}

  //   async insertAcTechKeyword(createAcTechDto: CreateAcTechDto) {
  //     await this.dataSource.transaction(async (manager) => {
  //       const acTechRepository = manager.withRepository(this.acTechRepository);
  //       const acKeywordRepository = manager.withRepository(
  //         this.acKeywordRepository,
  //       );
  //       const acTechKeywordRepository = manager.withRepository(
  //         this.acTechKeywordRepository,
  //       );

  //     });
  //   }
}
