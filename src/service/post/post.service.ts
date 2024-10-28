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
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Recaptcha } from '../../library/recaptcha';
import { Pagination } from 'src/library/pagination';
import { Utility } from 'src/library';
import * as dayjs from 'dayjs';

const pageSize = 6;
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
      throw new ForbiddenException('reCAPTCHA 토큰 검증에 실패했습니다.');
    }

    const decode = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decode.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    const trimTitle = title.trim();
    const trimText = text.trim();

    if (!utility.isValidPost(trimTitle, trimText)) {
      throw new BadRequestException('게시글 형식이 잘못되었습니다.');
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
      message: '게시 완료!',
    };
  }

  public async getPublicPosts(
    query: GetPostPageDto,
  ): Promise<IPaginationData<PostPreviewDto[]>> {
    const { page } = query;

    const posts = (await this.postRepository.find()).reverse();

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

    if (!data.length) throw new NotFoundException('등록된 게시글이 없습니다.');

    const pagination = paginator.paginateData(data, page, pageSize);
    return pagination;
  }

  public async getMyPosts(
    req: IRequest,
    query: GetPostPageDto,
  ): Promise<IPaginationData<MyPostsDto[]>> {
    const { page } = query;

    const decoded = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    const posts = (
      await this.postRepository.find({
        where: {
          user_id: user.user_id,
        },
      })
    ).reverse();

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
      throw new NotFoundException('등록된 게시글이 없습니다.');
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
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    if (!post.public_post) {
      throw new UnauthorizedException(
        '해당 게시글에 접근할 수 있는 권한이 없습니다.',
      );
    }
    const publisher = await this.userRepository.findOne({
      where: {
        user_id: post.user_id,
      },
    });
    if (!publisher) {
      throw new NotFoundException('해당 게시글의 사용자를 찾을 수 없습니다.');
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
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }
    const decoded = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }
    if (post.user_id !== user.user_id) {
      throw new UnauthorizedException(
        '해당 게시글에 접근할 수 있는 권한이 없습니다.',
      );
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
      throw new ForbiddenException('reCAPTCHA 토큰 검증에 실패했습니다.');
    }

    const decode = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decode.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    if (post.user_id !== user.user_id) {
      throw new UnauthorizedException(
        '해당 게시글을 수정할 수 있는 권한이 없습니다.',
      );
    }

    const trimTitle = title.trim();
    const trimText = text.trim();

    if (!utility.isValidPost(trimTitle, trimText)) {
      throw new BadRequestException('게시글 형식이 잘못되었습니다.');
    }

    const preview = text.substring(0, previewLength);

    post.title = trimTitle;
    post.text = trimText;
    post.preview = preview;
    post.public_post = public_post;
    post.edited_at = now;

    this.postRepository.save(post);

    return {
      message: '게시글이 수정되었습니다.',
    };
  }

  public async removePost(
    req: IRequest,
    query: GetPostDto,
  ): Promise<MessageDto> {
    const { id } = query;

    const decoded = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decoded.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    if (post.user_id !== user.user_id) {
      throw new UnauthorizedException(
        '해당 게시글을 삭제할 수 있는 권한이 없습니다.',
      );
    }

    this.postRepository.delete({
      id,
    });

    return {
      message: '게시글이 삭제 되었습니다.',
    };
  }
}
