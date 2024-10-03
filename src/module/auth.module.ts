import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controller/auth.controller';
import { UserEntity } from 'src/entity/user.entity';
import { LoginService } from 'src/service/auth/login.service';
import { RegisterService } from 'src/service/auth/register.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [LoginService, RegisterService],
})
export class AuthModule {}
