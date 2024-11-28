import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { IssueTokenResponse, LoginBodyDto } from 'src/dto/auth.dto';
import type { IQueryParams, JwtPayload } from 'src/types/auth';
import { UserEntity } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { IRequest } from 'src/types/headers';
import { Recaptcha } from 'src/library/recaptcha';
import { Korean } from 'src/locale/ko_kr';
import { JwtExpiresIn } from 'src/config';
import type { Repository } from 'typeorm';
import { Regex } from 'src/library/regex';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import * as dayjs from 'dayjs';

const reCaptcha = new Recaptcha();
const regex = new Regex();

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async createJWT(
    req: IRequest,
    dto: LoginBodyDto,
  ): Promise<IssueTokenResponse> {
    const { user_id, passphrase, g_recaptcha_response } = dto;
    const ip = (req.headers['x-forwarded-for'] ??
      req.socket.remoteAddress) as string;
    const now = dayjs().valueOf();

    const verify = await reCaptcha.verify(g_recaptcha_response, ip);
    if (!verify.success) {
      throw new ForbiddenException(Korean.RECAPTCHA_VERIFICATION_FAILED);
    }

    const query: IQueryParams = {};
    if (regex.isEmail(user_id)) {
      query.email = user_id;
    } else {
      query.user_id = user_id;
    }

    const user = await this.userRepository.findOne({
      where: query,
    });

    if (!user) {
      throw new UnauthorizedException(Korean.ID_OR_PASSWORD_MISMATCH);
    }

    const comparePassword = await compare(passphrase, user.passphrase);
    if (!comparePassword) {
      throw new UnauthorizedException(Korean.ID_OR_PASSWORD_MISMATCH);
    }

    const payload: JwtPayload = {
      user_id: user.user_id,
      id: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const expiresAt = now + JwtExpiresIn;
    return {
      message: Korean.WELCOME_USER.replace('{user}', user.user_id),
      data: {
        access_token: accessToken,
        expires_at: expiresAt,
      },
    };
  }
}
