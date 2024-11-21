import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { DraftBodyDto, LoadDraftDto } from 'src/dto/post.dto';
import type { JwtDecodedPayload } from 'src/types/auth';
import type { MessageDto } from 'src/dto/message.dto';
import { DraftEntity } from 'src/entity/draft.entity';
import { UserEntity } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { IRequest } from 'src/types/headers';
import { Korean } from 'src/locale/ko_kr';
import type { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Utility } from 'src/library';
import * as dayjs from 'dayjs';

const utility = new Utility();

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
    const jwtPayload = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_NOT_FOUND);
    }

    const trimTitle = title.trim();
    const trimText = text.trim();

    if (!utility.isValidPost(trimTitle, trimText)) {
      throw new BadRequestException(Korean.INVALID_POST_FORMAT);
    }

    const draft = await this.draftRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });

    if (!draft) {
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
      message: Korean.DRAFT_SAVED,
    };
  }

  public async loadDraft(req: IRequest): Promise<LoadDraftDto> {
    const jwtPayload = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_NOT_FOUND);
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
      throw new NotFoundException(Korean.NO_SAVED_DRAFT);
    }
  }

  public async removeDraft(req: IRequest): Promise<MessageDto> {
    const jwtPayload = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_NOT_FOUND);
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
    }
    return {
      message: Korean.DRAFT_DELETED,
    };
  }
}
