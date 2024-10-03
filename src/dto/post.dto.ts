import { RecaptchaDto } from './recaptcha.dto';

export class PostBodyDto extends RecaptchaDto {
  title: string;
  text: string;
  public_post?: string;
}

export class PostDataDto {
  title: string;
  text: string;
  author: string;
  profile_image: string;
  created_at: number;
}

export class GetPostPageDto {
  page: number;
}
