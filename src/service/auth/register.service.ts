import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BrandName, Korean, VerifyEmailLocale } from 'src/constant/locale';
import type { RegisterBodyDto } from 'src/dto/auth.dto';
import type { MessageDto } from 'src/dto/message.dto';
import type { IRequest } from '../../types/headers';
import { UserEntity } from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Recaptcha } from 'src/library/recaptcha';
import { Gravatar } from 'src/library/gravatar';
import type { Repository } from 'typeorm';
import { Regex } from 'src/library/regex';
import { Email } from 'src/library/email';
import { genSalt, hash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import * as dayjs from 'dayjs';

const regex = new Regex();
const gravatar = new Gravatar();
const reCaptcha = new Recaptcha();

const expiresIn = 86400000; // 24h

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
      throw new ForbiddenException(Korean.RECAPTCHA_VERIFICATION_FAILED);
    }

    if (!regex.isUserId(user_id)) {
      throw new BadRequestException(Korean.INVALID_ID_FORMAT);
    }

    if (!regex.isEmail(email)) {
      throw new BadRequestException(Korean.INVALID_EMAIL_FORMAT);
    }

    if (!regex.isPassword(passphrase)) {
      throw new BadRequestException(Korean.INVALID_PASSWORD_FORMAT);
    }

    const isUserIdExists = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });
    if (isUserIdExists) {
      throw new BadRequestException(Korean.ID_ALREADY_IN_USE);
    }

    const emailQuery = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (emailQuery) {
      throw new BadRequestException(Korean.EMAIL_ALREADY_IN_USE);
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
        subject: VerifyEmailLocale.SUBJECT,
      },
      {
        brand: BrandName,
        title: VerifyEmailLocale.TITLE,
        username: VerifyEmailLocale.USERNAME.replace('{user}', user_id),
        text_1: VerifyEmailLocale.TEXT_01,
        link: `${process.env.FRONTEND_HOST}/auth/verify?identifier=${identifier}`,
        text_2: VerifyEmailLocale.TEXT_02,
        text_3: VerifyEmailLocale.TEXT_03.replace('{date}', expiresDate),
      },
    );

    return {
      message: Korean.ACCOUNT_REGISTERED,
    };
  }
}
