import { JwtModuleOptions } from '@nestjs/jwt';
import { IPostRules } from 'src/types/constants';

export const POST: IPostRules = {
  maxTitleLength: 50,
  maxTextLength: 5000,
};

export const JwtOptions: JwtModuleOptions = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '12h',
  },
};
