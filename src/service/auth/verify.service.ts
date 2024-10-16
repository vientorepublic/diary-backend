import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/dto/message.dto';
import { UserEntity } from 'src/entity/user.entity';
import { IdentifierDto } from 'src/dto/auth.dto';
import { Repository } from 'typeorm';
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
      throw new NotFoundException('해당 식별자를 찾을 수 없습니다.');
    }
    if (user.verify_expiresAt && user.verify_expiresAt < now) {
      throw new BadRequestException('인증 링크가 만료되었습니다.');
    }
    user.verified = true;
    user.verify_identifier = null;
    user.verify_expiresAt = null;
    this.userRepository.save(user);
    return {
      message: '계정 활성화가 완료되었습니다.',
    };
  }

  public async validateIdentifier(query: IdentifierDto): Promise<MessageDto> {
    const { identifier } = query;
    const now = dayjs().valueOf();
    const user = await this.userRepository.findOne({
      where: {
        verify_identifier: identifier,
      },
    });
    if (!user) {
      throw new NotFoundException('해당 식별자를 찾을 수 없습니다.');
    }
    if (user.verify_expiresAt && user.verify_expiresAt < now) {
      throw new BadRequestException('인증 링크가 만료되었습니다.');
    }
    return {
      message: '유효한 식별자입니다.',
    };
  }
}