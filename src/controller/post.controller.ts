import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Request, UseGuards } from '@nestjs/common';
import { MessageDto } from 'src/dto/message.dto';
import {
  GetPostDto,
  GetPostPageDto,
  MyPostsDto,
  PostBodyDto,
  PostDataDto,
  PostPreviewDto,
} from 'src/dto/post.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { PostService } from 'src/service/post/post.service';
import { IRequest } from 'src/types/headers';
import { IPaginationData } from 'src/types/pagination';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @TypedRoute.Get('posts')
  public async getPosts(
    @TypedQuery() query: GetPostPageDto,
  ): Promise<IPaginationData<PostPreviewDto[]>> {
    return this.postService.getPublicPosts(query);
  }

  @TypedRoute.Get('view')
  public async getPost(@TypedQuery() query: GetPostDto): Promise<PostDataDto> {
    return this.postService.getPublicPost(query);
  }

  @TypedRoute.Get('myPosts')
  @UseGuards(AuthGuard)
  public async getMyPosts(
    @Request() req: IRequest,
    @TypedQuery() query: GetPostPageDto,
  ): Promise<IPaginationData<MyPostsDto[]>> {
    return this.postService.getMyPosts(req, query);
  }

  @TypedRoute.Get('viewPrivate')
  @UseGuards(AuthGuard)
  public async getPrivatePost(
    @Request() req: IRequest,
    @TypedQuery() query: GetPostDto,
  ): Promise<PostDataDto> {
    return this.postService.getPrivatePost(req, query);
  }

  @TypedRoute.Post('save')
  @UseGuards(AuthGuard)
  public async publishPost(
    @Request() req: IRequest,
    @TypedBody() dto: PostBodyDto,
  ): Promise<MessageDto> {
    return this.postService.savePost(req, dto);
  }

  @TypedRoute.Delete('removePost')
  @UseGuards(AuthGuard)
  public async removePost(
    @Request() req: IRequest,
    @TypedQuery() query: GetPostDto,
  ): Promise<MessageDto> {
    return this.postService.removePost(req, query);
  }
}
