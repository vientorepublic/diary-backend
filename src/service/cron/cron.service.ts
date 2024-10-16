import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class CronService {
  private readonly logger = new Logger('Cronjob');
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async cleanup() {
    // Delete Unverified & Expired Accounts
    const now = dayjs().valueOf();
    const users = await this.userRepository.find();
    for (let i = 0; i < users.length; i++) {
      const { user_id, verified, verify_expiresAt } = users[i];
      if (!verified && verify_expiresAt && verify_expiresAt < now) {
        this.userRepository.delete({ user_id });
        this.logger.log(`Cleanup job - Delete unverified account: ${user_id}`);
      }
    }
  }
}
