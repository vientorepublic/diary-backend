import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { JwtDecodedPayload } from 'src/types/auth';
import { IRequest } from 'src/types/headers';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async getUserInfo(req: IRequest) {
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
}
