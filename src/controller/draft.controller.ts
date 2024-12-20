import { Controller, Request, UseGuards } from '@nestjs/common';
import { DraftService } from 'src/service/draft/draft.service';
import type { MessageDto } from 'src/dto/message.dto';
import type { DraftBodyDto } from 'src/dto/post.dto';
import { TypedBody, TypedRoute } from '@nestia/core';
import type { IRequest } from 'src/types/headers';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('post/draft')
@UseGuards(AuthGuard)
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @TypedRoute.Post('saveDraft')
  public async saveDraft(
    @Request() req: IRequest,
    @TypedBody() dto: DraftBodyDto,
  ): Promise<MessageDto> {
    return this.draftService.saveDraft(req, dto);
  }

  @TypedRoute.Get('loadDraft')
  public async loadDraft(@Request() req: IRequest) {
    return this.draftService.loadDraft(req);
  }

  @TypedRoute.Delete('removeDraft')
  public async removeDraft(@Request() req: IRequest) {
    return this.draftService.removeDraft(req);
  }
}
