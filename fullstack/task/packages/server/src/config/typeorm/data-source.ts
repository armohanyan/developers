import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { typeormConfig } from './typeorm-config';

export const AppDataSource = new DataSource({
  ...typeormConfig,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
  subscribers: [],
});
