import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPostPageDto, PostBodyDto, PostDataDto } from 'src/dto/post.dto';
import { PostEntity } from 'src/entity/post.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { IRequest } from '../../types/headers';
import { JwtService } from '@nestjs/jwt';
import { JwtDecodedPayload } from 'src/types/auth';
import { Recaptcha } from '../../library/recaptcha';
import { MessageDto } from 'src/dto/message.dto';
import { Pagination } from 'src/library/pagination';
import { IPaginationData } from 'src/types/pagination';
import * as dayjs from 'dayjs';

const reCaptcha = new Recaptcha();
const paginator = new Pagination();

@Injectable()
export class PostService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async publishPost(
    req: IRequest,
    dto: PostBodyDto,
  ): Promise<MessageDto> {
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

    if (title.length > 50) {
      throw new BadRequestException(
        '게시글 제목은 50바이트를 초과할 수 없습니다.',
      );
    }

    if (text.length > 65000) {
      throw new BadRequestException(
        '게시글 본문은 65000바이트를 초과할 수 없습니다.',
      );
    }

    const data = this.postRepository.create({
      ...dto,
      user_id: user.user_id,
      public_post: public_post ? true : false,
      created_at: now,
    });

    this.postRepository.save(data);

    return {
      message: '저장 완료!',
    };
  }

  public async getPosts(
    query: GetPostPageDto,
  ): Promise<IPaginationData<PostDataDto[]>> {
    const { page } = query;

    const posts = await this.postRepository.find();
    if (!posts.length) throw new NotFoundException('등록된 게시글이 없습니다.');

    const data: PostDataDto[] = [];
    for (let i = 0; i < posts.length; i++) {
      const user = await this.userRepository.findOne({
        order: {
          id: 'ASC',
        },
        where: {
          user_id: posts[i].user_id,
        },
      });
      const profileImage = user ? user.profile_image : '';
      data.push({
        title: posts[i].title,
        text: posts[i].text,
        author: posts[i].user_id,
        profile_image: profileImage,
        created_at: Number(posts[i].created_at),
      });
    }

    const pagination = paginator.paginateData(data, page, 6);
    return pagination;
  }

  public async draftPosts() {}
}
