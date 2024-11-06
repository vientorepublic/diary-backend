import { typeormConfig } from 'src/database/database.provider';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from './search.module';
import { DraftModule } from './draft.module';
import { PostModule } from './post.module';
import { CronModule } from './cron.module';
import { MainModule } from './main.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { JwtOptions } from 'src/constant';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    JwtModule.register(JwtOptions),
    ScheduleModule.forRoot(),
    MainModule,
    AuthModule,
    UserModule,
    PostModule,
    SearchModule,
    DraftModule,
    CronModule,
  ],
})
export class AppModule {}
