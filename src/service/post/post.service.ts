import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EditPostDto,
  GetPostDto,
  GetPostPageDto,
  MyPostsDto,
  PostBodyDto,
  PostDataDto,
  PostPreviewDto,
} from 'src/dto/post.dto';
import type { IPaginationData } from 'src/types/pagination';
import type { JwtDecodedPayload } from 'src/types/auth';
import type { MessageDto } from 'src/dto/message.dto';
import type { IRequest } from '../../types/headers';
import { PostEntity } from 'src/entity/post.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Recaptcha } from '../../library/recaptcha';
import { Pagination } from 'src/library/pagination';
import { Korean } from 'src/constant/locale';
import type { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Utility } from 'src/library';
import * as dayjs from 'dayjs';

const pageSize = Number(process.env.PAGE_SIZE) || 6;
const previewLength = 100;

const reCaptcha = new Recaptcha();
const paginator = new Pagination();
const utility = new Utility();

@Injectable()
export class PostService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async savePost(req: IRequest, dto: PostBodyDto): Promise<MessageDto> {
    const { title, text, public_post, g_recaptcha_response } = dto;
    const ip = (req.headers['x-forwarded-for'] ??
      req.socket.remoteAddress) as string;
    const now = dayjs().valueOf();

    const verify = await reCaptcha.verify(g_recaptcha_response, ip);
    if (!verify.success) {
      throw new ForbiddenException(Korean.RECAPTCHA_VERIFICATION_FAILED);
    }

    const decode = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decode.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_DATA_NOT_FOUND);
    }

    const trimTitle = title.trim();
    const trimText = text.trim();

    if (!utility.isValidPost(trimTitle, trimText)) {
      throw new BadRequestException(Korean.INVALID_POST_FORMAT);
    }

    const preview = text.substring(0, previewLength);

    const data = this.postRepository.create({
      title: trimTitle,
      text: trimText,
      preview,
      public_post,
      user_id: user.user_id,
      created_at: now,
    });

    this.postRepository.save(data);

    return {
      message: Korean.POST_PUBLISHED,
    };
  }

  public async getPublicPosts(
    query: GetPostPageDto,
  ): Promise<IPaginationData<PostPreviewDto[]>> {
    const { page, sort } = query;

    const posts = await this.postRepository.find({
      order: {
        id: sort === 'latest' ? 'DESC' : 'ASC',
      },
    });

    const data: PostPreviewDto[] = [];
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].public_post) {
        const publisher = await this.userRepository.findOne({
          where: {
            user_id: posts[i].user_id,
          },
        });
        const profileImage = publisher ? publisher.profile_image : '';
        data.push({
          id: posts[i].id,
          title: posts[i].title,
          preview: posts[i].preview,
          author: posts[i].user_id,
          profile_image: profileImage,
          created_at: Number(posts[i].created_at),
          edited_at: Number(posts[i].edited_at),
        });
      }
    }

    if (!data.length) throw new NotFoundException(Korean.NO_PUBLISHED_POSTS);

    const pagination = paginator.paginateData(data, page, pageSize);
    return pagination;
  }

  public async getMyPosts(
    req: IRequest,
    query: GetPostPageDto,
  ): Promise<IPaginationData<MyPostsDto[]>> {
    const { page, sort } = query;
    const jwtPayload = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_DATA_NOT_FOUND);
    }

    const posts = await this.postRepository.find({
      where: {
        user_id: user.user_id,
      },
      order: {
        id: sort === 'latest' ? 'DESC' : 'ASC',
      },
    });

    const data: MyPostsDto[] = [];
    for (let i = 0; i < posts.length; i++) {
      data.push({
        id: posts[i].id,
        title: posts[i].title,
        preview: posts[i].preview,
        author: posts[i].user_id,
        public_post: posts[i].public_post,
        profile_image: user.profile_image,
        created_at: Number(posts[i].created_at),
        edited_at: Number(posts[i].edited_at),
      });
    }

    if (!data.length) {
      throw new NotFoundException(Korean.NO_PUBLISHED_POSTS);
    }

    const pagination = paginator.paginateData(data, page, pageSize);
    return pagination;
  }

  public async getPublicPost(query: GetPostDto): Promise<PostDataDto> {
    const { id } = query;
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException(Korean.POST_NOT_FOUND);
    }
    if (!post.public_post) {
      throw new UnauthorizedException(Korean.NO_POST_READ_PERMISSION);
    }
    const publisher = await this.userRepository.findOne({
      where: {
        user_id: post.user_id,
      },
    });
    if (!publisher) {
      throw new NotFoundException(Korean.POST_PUBLISHER_NOT_FOUND);
    }
    return {
      id: post.id,
      title: post.title,
      text: post.text,
      author: post.user_id,
      profile_image: publisher.profile_image,
      created_at: Number(post.created_at),
      edited_at: Number(post.edited_at),
    };
  }

  public async getPrivatePost(
    req: IRequest,
    query: GetPostDto,
  ): Promise<PostDataDto> {
    const { id } = query;
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException(Korean.POST_NOT_FOUND);
    }
    const jwtPayload = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_DATA_NOT_FOUND);
    }
    if (post.user_id !== user.user_id) {
      throw new UnauthorizedException(Korean.NO_POST_READ_PERMISSION);
    }
    return {
      id: post.id,
      title: post.title,
      text: post.text,
      author: post.user_id,
      profile_image: user.profile_image,
      created_at: Number(post.created_at),
      edited_at: Number(post.edited_at),
    };
  }

  public async editPost(req: IRequest, dto: EditPostDto): Promise<MessageDto> {
    const { id, title, text, public_post, g_recaptcha_response } = dto;
    const ip = (req.headers['x-forwarded-for'] ??
      req.socket.remoteAddress) as string;
    const now = dayjs().valueOf();

    const verify = await reCaptcha.verify(g_recaptcha_response, ip);
    if (!verify.success) {
      throw new ForbiddenException(Korean.RECAPTCHA_VERIFICATION_FAILED);
    }

    const decode = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decode.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_DATA_NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException(Korean.POST_NOT_FOUND);
    }

    if (post.user_id !== user.user_id) {
      throw new UnauthorizedException(Korean.NO_POST_EDIT_PERMISSION);
    }

    const trimTitle = title.trim();
    const trimText = text.trim();

    if (!utility.isValidPost(trimTitle, trimText)) {
      throw new BadRequestException(Korean.INVALID_POST_FORMAT);
    }

    const preview = text.substring(0, previewLength);

    post.title = trimTitle;
    post.text = trimText;
    post.preview = preview;
    post.public_post = public_post;
    post.edited_at = now;

    this.postRepository.save(post);

    return {
      message: Korean.POST_EDITED,
    };
  }

  public async removePost(
    req: IRequest,
    query: GetPostDto,
  ): Promise<MessageDto> {
    const { id } = query;

    const jwtPayload = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: jwtPayload.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException(Korean.USER_DATA_NOT_FOUND);
    }

    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException(Korean.POST_NOT_FOUND);
    }

    if (post.user_id !== user.user_id) {
      throw new UnauthorizedException(Korean.NO_POST_DELETE_PERMISSION);
    }

    this.postRepository.delete({
      id,
    });

    return {
      message: Korean.POST_DELETED,
    };
  }
}
