import { typeormConfig } from 'src/database/database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainModule } from './main.module';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './post.module';
import { DraftModule } from './draft.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '12h',
      },
    }),
    MainModule,
    AuthModule,
    UserModule,
    PostModule,
    DraftModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
