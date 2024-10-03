import { MessageDto } from './message.dto';
import { RecaptchaDto } from './recaptcha.dto';

export class RegisterBodyDto extends RecaptchaDto {
  user_id: string;
  email: string;
  passphrase: string;
}

export class LoginBodyDto extends RecaptchaDto {
  user_id: string;
  passphrase: string;
}

export class IssueTokenResponse extends MessageDto {
  data: {
    access_token: string;
    expires_at: number;
  };
}
