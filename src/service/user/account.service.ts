import type { MyInfoDto, UserInfoDto, UserQueryParams } from 'src/dto/user.dto';
import type { JwtDecodedPayload } from 'src/types/auth';
import type { IRequest } from 'src/types/headers';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
      return {
        id: user.id,
        user_id: user.user_id,
        profile_image: user.profile_image,
        permission: user.permission,
      };
    } else {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }
  }
}
