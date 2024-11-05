import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entity/post.entity';
import { UserEntity } from 'src/entity/user.entity';
import { CronService } from 'src/service/cron/cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  providers: [CronService],
})
export class CronModule {}
