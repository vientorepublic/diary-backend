import { CronService } from 'src/service/cron/cron.service';
import { PostEntity } from 'src/entity/post.entity';
import { UserEntity } from 'src/entity/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PostEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class CronModule {}
