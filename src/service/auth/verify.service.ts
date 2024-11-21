import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MessageDto } from 'src/dto/message.dto';
import type { IdentifierDto } from 'src/dto/auth.dto';
import { UserEntity } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Korean } from 'src/locale/ko_kr';
import type { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async processVerify(dto: IdentifierDto): Promise<MessageDto> {
    const { identifier } = dto;
    const now = dayjs().valueOf();
    const user = await this.userRepository.findOne({
      where: {
        verify_identifier: identifier,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_NOT_FOUND);
    }
    const expiresAt = Number(user.verify_expiresAt);
    if (expiresAt && expiresAt < now) {
      throw new BadRequestException(Korean.VERIFY_LINK_EXPIRED);
    }
    user.verified = true;
    user.verify_identifier = null;
    user.verify_expiresAt = null;
    this.userRepository.save(user);
    return {
      message: Korean.ACCOUNT_ACTIVATED,
    };
  }
}
