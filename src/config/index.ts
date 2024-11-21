import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { IPostRules } from 'src/types/constants';
import type { JwtModuleOptions } from '@nestjs/jwt';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV == 'development',
};

export const JwtExpiresIn = Number(process.env.JWT_PERIOD) || 43200000;

export const pageSize = Number(process.env.PAGE_SIZE) || 6;

export const previewLength = 100;

export const PostRules: IPostRules = {
  maxTitleLength: 50,
  maxTextLength: 5000,
};

export const JwtOptions: JwtModuleOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: JwtExpiresIn,
  },
};
