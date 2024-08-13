import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_TYPE } =
    process.env;
  console.log(DB_PORT);
  return {
    type: DB_TYPE as any,
    host: DB_HOST,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: +DB_PORT,
    autoLoadEntities: false,
    synchronize: true,

    entities: ['dist/**/**/*.entity.{ts,js}', 'dist/**/**/**/*.entity.{ts,js}'],
  };
}
