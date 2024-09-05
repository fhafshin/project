import { config } from 'dotenv';

import { DataSource } from 'typeorm';
config();
config({ path: process.cwd() + '.env' });
const { DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  password: DB_PASSWORD,
  username: DB_USERNAME,
  database: DB_NAME,
  port: +DB_PORT,
  synchronize: false,
  entities: ['dist/**/**/*.entity.{ts,js}', 'dist/**/**/**/*.entity.{ts,js}'],

  migrations: ['dist/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'paper_migration_db',
});

export default dataSource;