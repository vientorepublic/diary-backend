import type { IPostRules } from 'src/types/constants';
import type { JwtModuleOptions } from '@nestjs/jwt';

export const PostRules: IPostRules = {
  maxTitleLength: 50,
  maxTextLength: 5000,
};

export const JwtExpiresIn = Number(process.env.JWT_PERIOD) || 43200000;

export const JwtOptions: JwtModuleOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: JwtExpiresIn,
  },
};
