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

const regex = new Regex();
const gravatar = new Gravatar();
const reCaptcha = new Recaptcha();

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
    const avatar = gravatar.getGravatarUrl(email);
    const data = this.userRepository.create({
      passphrase: encryptedPassword,
      profile_image: avatar,
      user_id,
      email,
    });

    this.userRepository.save(data);

    return {
      message: '가입이 완료되었습니다.',
    };
  }
}
