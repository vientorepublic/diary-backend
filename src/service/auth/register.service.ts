import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterBodyDto } from 'src/dto/auth.dto';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { IRequest } from '../../types/headers';
import { Regex } from 'src/library/regex';
import { Gravatar } from 'src/library/gravatar';
import { UserEntity } from 'src/entity/user.entity';
import { MessageDto } from 'src/dto/message.dto';
import { Recaptcha } from 'src/library/recaptcha';
import { Email } from 'src/library/email';
import { v4 as uuidV4 } from 'uuid';
import * as dayjs from 'dayjs';

const regex = new Regex();
const gravatar = new Gravatar();
const reCaptcha = new Recaptcha();

// 24h
const expiresIn = 86400000;

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async createAccount(
    req: IRequest,
    dto: RegisterBodyDto,
  ): Promise<MessageDto> {
    const { user_id, passphrase, email, g_recaptcha_response } = dto;
    const ip = (req.headers['x-forwarded-for'] ??
      req.socket.remoteAddress) as string;
    const now = dayjs().valueOf();

    const verify = await reCaptcha.verify(g_recaptcha_response, ip);
    if (!verify.success) {
      throw new ForbiddenException('reCAPTCHA 토큰 검증에 실패했습니다.');
    }

    if (!regex.isUserId(user_id)) {
      throw new BadRequestException('아이디 형식이 일치하지 않습니다.');
    }

    if (!regex.isEmail(email)) {
      throw new BadRequestException('이메일 주소 형식이 일치하지 않습니다.');
    }

    if (!regex.isPassword(passphrase)) {
      throw new BadRequestException('비밀번호 형식이 일치하지 않습니다.');
    }

    const isUserIdExists = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });
    if (isUserIdExists) {
      throw new BadRequestException('해당 아이디는 이미 사용중입니다.');
    }

    const isEmailExists = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (isEmailExists) {
      throw new BadRequestException('해당 이메일 주소는 이미 사용중입니다.');
    }

    const salt = await genSalt(10);
    const encryptedPassword = await hash(passphrase, salt);
    const avatar = gravatar.get(email);
    const expiresAt = now + expiresIn;
    const expiresDate = dayjs(expiresAt).format('YYYY-MM-DD HH:mm:ss');
    const identifier = uuidV4();
    const data = this.userRepository.create({
      passphrase: encryptedPassword,
      profile_image: avatar,
      verify_identifier: identifier,
      verify_expiresAt: expiresAt,
      user_id,
      email,
    });

    this.userRepository.save(data);

    new Email(email).send(
      {
        subject: '[글귀저장소] 계정 이메일 인증',
      },
      {
        brand: '글귀저장소',
        title: '계정 이메일 인증',
        username: `안녕하세요, ${user_id}님.`,
        text_1: '이메일 인증을 완료하려면 아래 링크를 열어주세요.',
        link: `${process.env.FRONTEND_HOST}/auth/verify?identifier=${identifier}`,
        text_2: '이메일 인증을 요청하지 않으셨다면, 본 이메일을 무시해 주세요.',
        text_3: `인증 링크는 한국 표준시 기준 ${expiresDate}에 만료됩니다.`,
      },
    );

    return {
      message:
        '가입이 완료되었습니다. 계정 활성화를 위해 이메일을 확인해주세요.',
    };
  }
}
