import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_PORT, DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;
  console.log(DB_USERNAME);
  return {
    type: 'postgres',
    host: DB_HOST,
    username: 'postgres',
    password: '123456',
    database: DB_NAME,
    port: +DB_PORT,
    autoLoadEntities: false,
    synchronize: true,

    entities: ['dist/**/**/*.entity.{ts,js}', 'dist/**/**/**/*.entity.{ts,js}'],
  };
}
