import { AccountService } from 'src/service/user/account.service';
import { UserController } from 'src/controller/user.controller';
import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [AccountService],
})
export class UserModule {}
