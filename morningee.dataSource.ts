import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CustomNamingStrategy } from './src/global/customNamingStrategy';
import { User } from 'src/model/entity/user.entity';
import { entities } from './src/global/global.entitity';
import { Plan } from 'src/model/entity/plan.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_LATTICE_DATABASE,
  logging: false,
  // entities: ['./src/model/entity/*.entity.ts'], // entity metadata
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
  //   Plan,
  // ], // entity metadata
  entities: entities,
  namingStrategy: new CustomNamingStrategy(),
  migrations: [__dirname + '/src/migrations/*.ts'],
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default dataSource;
