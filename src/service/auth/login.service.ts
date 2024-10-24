import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IssueTokenResponse, LoginBodyDto } from 'src/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { Regex } from 'src/library/regex';
import type { IRequest } from 'src/types/headers';
import type { IQueryParams, JwtPayload } from 'src/types/auth';
import { UserEntity } from 'src/entity/user.entity';
import { Recaptcha } from 'src/library/recaptcha';

const period = Number(process.env.JWT_PERIOD) || 43200000;
const reCaptcha = new Recaptcha();
const regex = new Regex();

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async issueToken(
    req: IRequest,
    dto: LoginBodyDto,
  ): Promise<IssueTokenResponse> {
    const { user_id, passphrase, g_recaptcha_response } = dto;
    const ip = (req.headers['x-forwarded-for'] ??
      req.socket.remoteAddress) as string;

    const verify = await reCaptcha.verify(g_recaptcha_response, ip);
    if (!verify.success) {
      throw new ForbiddenException('reCAPTCHA 토큰 검증에 실패했습니다.');
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
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const comparePassword = await compare(passphrase, user.passphrase);
    if (!comparePassword) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    if (!user.verified) {
      throw new UnauthorizedException(
        '계정이 아직 활성화 되지 않았습니다. 이메일을 확인해주세요.',
      );
    }

    const payload: JwtPayload = {
      user_id: user.user_id,
      sub: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const expiresAt = new Date().getTime() + period;
    return {
      message: `환영합니다, ${user.user_id}님!`,
      data: {
        access_token: accessToken,
        expires_at: expiresAt,
      },
    };
  }
}
