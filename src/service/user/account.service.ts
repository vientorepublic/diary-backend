import type { MyInfoDto, UserInfoDto, UserQueryParams } from 'src/dto/user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { JwtDecodedPayload } from 'src/types/auth';
import { UserEntity } from 'src/entity/user.entity';
import { PostEntity } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { IRequest } from 'src/types/headers';
import { Korean } from 'src/locale/ko_kr';
import type { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private jwtService: JwtService,
  ) {}

  public async getMyInfo(req: IRequest): Promise<MyInfoDto> {
    const decode = this.jwtService.decode<JwtDecodedPayload>(req.token);
    const user = await this.userRepository.findOne({
      where: {
        user_id: decode.user_id,
      },
    });
    if (user) {
      return {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        profile_image: user.profile_image,
        permission: user.permission,
      };
    } else {
      throw new NotFoundException();
    }
  }

  public async getUserInfo(query: UserQueryParams): Promise<UserInfoDto> {
    const { id } = query;
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });
    if (user) {
      const postCount = await this.postRepository.countBy({
        user_id: id,
        public_post: true,
      });
      const latestPost = await this.postRepository
        .createQueryBuilder('posts')
        .where('user_id = :user', { user: id })
        .andWhere('public_post = :public', { public: true })
        .orderBy('id', 'DESC')
        .getOne();
      let lastActivityDate = 0;
      if (latestPost) {
        const createdAt = Number(latestPost.created_at);
        const editedAt = Number(latestPost.edited_at);
        if (editedAt) lastActivityDate = editedAt;
        else lastActivityDate = createdAt;
      }
      return {
        id: user.id,
        user_id: user.user_id,
        verified: user.verified,
        profile_image: user.profile_image,
        permission: user.permission,
        stats: {
          postCount,
          lastActivityDate,
        },
      };
    } else {
      throw new NotFoundException(Korean.USER_NOT_FOUND);
    }
  }
}
