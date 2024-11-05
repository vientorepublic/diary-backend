import { RegisterService } from 'src/service/auth/register.service';
import { VerifyService } from 'src/service/auth/verify.service';
import { AuthController } from 'src/controller/auth.controller';
import { LoginService } from 'src/service/auth/login.service';
import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [LoginService, RegisterService, VerifyService],
})
export class AuthModule {}
