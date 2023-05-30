import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/entity/user.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { CustomNamingStrategy } from './customNamingStrategy';
import { constantString } from './global.constants';
import { DataSource } from 'typeorm';
import dataSource from 'morningee.dataSource';
import { entities } from './global.entitity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      name: constantString.morningeeConnection,
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
