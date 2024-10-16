import { typeormConfig } from 'src/database/database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainModule } from './main.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './post.module';
import { DraftModule } from './draft.module';
import { JwtOptions } from 'src/constant';
import { CronModule } from './cron.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    JwtModule.register(JwtOptions),
    MainModule,
    AuthModule,
    UserModule,
    PostModule,
    DraftModule,
    CronModule,
  ],
})
export class AppModule {}
