import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/dto/message.dto';
import { DraftBodyDto, LoadDraftDto } from 'src/dto/post.dto';
import { DraftEntity } from 'src/entity/draft.entity';
import { UserEntity } from 'src/entity/user.entity';
import { JwtDecodedPayload } from 'src/types/auth';
import { IRequest } from 'src/types/headers';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class DraftService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DraftEntity)
    private readonly draftRepository: Repository<DraftEntity>,
  ) {}

  public async saveDraft(
    req: IRequest,
    dto: DraftBodyDto,
  ): Promise<MessageDto> {
    const { title, text } = dto;
    const now = dayjs().valueOf();
    const decoded = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    const draft = await this.draftRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });

    const trimTitle = title.trim();
    const trimText = text.trim();

    if (!draft) {
      if (!trimTitle || !trimText) {
        throw new BadRequestException('제목 또는 본문이 비어있습니다.');
      }

      if (trimTitle.length > 50) {
        throw new BadRequestException(
          '게시글 제목은 50바이트를 초과할 수 없습니다.',
        );
      }

      if (trimText.length > 5000) {
        throw new BadRequestException(
          '게시글 본문은 5000바이트를 초과할 수 없습니다.',
        );
      }

      const data = this.draftRepository.create({
        title: trimTitle,
        text: trimText,
        user_id: user.user_id,
        modified_at: now,
      });

      this.draftRepository.save(data);
    } else {
      draft.title = trimTitle;
      draft.text = trimText;
      this.draftRepository.save(draft);
    }

    return {
      message: '초안이 저장되었습니다.',
    };
  }

  public async loadDraft(req: IRequest): Promise<LoadDraftDto> {
    const decoded = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }
    const draft = await this.draftRepository.findOne({
      where: {
        user_id: user.user_id,
      },
    });
    if (draft) {
      return {
        title: draft.title,
        text: draft.text,
      };
    } else {
      throw new NotFoundException('저장된 초안이 없습니다.');
    }
  }

  public async removeDraft(req: IRequest): Promise<MessageDto> {
    const decoded = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }
    const draft = await this.draftRepository.findOne({
      where: {
        user_id: user.user_id,
      },
    });
    if (draft) {
      this.draftRepository.delete({
        user_id: user.user_id,
      });
      return {
        message: '초안이 삭제되었습니다.',
      };
    } else {
      throw new NotFoundException('저장된 초안이 없습니다.');
    }
  }
}
