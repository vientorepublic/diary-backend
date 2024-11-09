import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/entity/user.entity';
import { PostEntity } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class CronService {
  private readonly logger = new Logger('Cronjob');
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async cleanup() {
    const now = dayjs().valueOf();
    const users = await this.userRepository.find({
      where: {
        verified: false,
      },
    });
    for (let i = 0; i < users.length; i++) {
      const { user_id, verify_expiresAt } = users[i];
      const expiresAt = Number(verify_expiresAt);
      if (expiresAt && expiresAt < now) {
        this.userRepository.delete({ user_id });
        this.postRepository.delete({ user_id });
        this.logger.log(`Cleanup job - Delete unverified account: ${user_id}`);
      }
    }
  }
}
