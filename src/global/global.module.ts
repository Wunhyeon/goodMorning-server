import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accelerator } from 'src/model/entity/accelerator.entity';
import { AcStructure } from 'src/model/entity/acStructure.entity';
import { AcUser } from 'src/model/entity/acUser.entity';
import { AuthorityPolicy } from 'src/model/entity/authorityPolicy.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { Portfolio } from 'src/model/entity/portfolio.entity';
import { CustomNamingStrategy } from './customNamingStrategy';
import { constantString } from './global.constants';
import { AcTech } from 'src/model/entity/acTech.entity';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcTechKeyword } from 'src/model/entity/acTechKeyword.entity';
import { DataSource } from 'typeorm';
import dataSource from 'lattice.a-type.dataSource';
import { entities } from './global.entitity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      name: constantString.latticeConnection,
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_LATTICE_DATABASE'),
        logging: false,
        // entities: [
        //   Portfolio,
        //   AcUser,
        //   AuthorityPolicy,
        //   MasterUser,
        //   AcStructure,
        //   Accelerator,
        //   AcTech,
        //   AcKeyword,
        //   AcTechKeyword,
        // ], // entity metadata
        entities: entities,
        // entities: ['../model/entity/*.entity.ts'],

        namingStrategy: new CustomNamingStrategy(),
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  exports: [],
})
export class GlobalModule {}
