import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Request, UseGuards } from '@nestjs/common';
import { MessageDto } from 'src/dto/message.dto';
import { GetPostPageDto, PostBodyDto, PostDataDto } from 'src/dto/post.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PostService } from 'src/service/post/post.service';
import { IRequest } from 'src/types/headers';
import { IPaginationData } from 'src/types/pagination';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @TypedRoute.Get('getPosts')
  public async getPosts(
    @TypedQuery() query: GetPostPageDto,
  ): Promise<IPaginationData<PostDataDto[]>> {
    return this.postService.getPosts(query);
  }

  @TypedRoute.Post('publish')
  @UseGuards(AuthGuard)
  public async publishPost(
    @Request() req: IRequest,
    @TypedBody() dto: PostBodyDto,
  ): Promise<MessageDto> {
    return this.postService.publishPost(req, dto);
  }
}
