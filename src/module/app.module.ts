import { JwtOptions, typeormConfig } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from './search.module';
import { DraftModule } from './draft.module';
import { PostModule } from './post.module';
import { CronModule } from './cron.module';
import { MainModule } from './main.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    JwtModule.register(JwtOptions),
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
