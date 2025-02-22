import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from './src/enum/config.enum';

// 根据不同环境下读取不同的.env文件
function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  } else {
    return {};
  }
}
// 获取所有实体文件
const entities =
  process.env.NODE_ENV === 'test'
    ? [__dirname + '/**/*.entity.ts']
    : [__dirname + '/**/*.entity{.ts,.js}'];

function buildConnectionParams(): TypeOrmModuleOptions {
  const defultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || `development`}`);
  const config = { ...defultConfig, ...envConfig };
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: entities,
    synchronize: true,
    logging: true,
  } as unknown as TypeOrmModuleOptions;
}
export const connectionParams = buildConnectionParams();

export default new DataSource({
  ...connectionParams,
  migrations: ['../src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
