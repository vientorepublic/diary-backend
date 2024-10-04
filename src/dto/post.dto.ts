import { RecaptchaDto } from './recaptcha.dto';

export class PostBodyDto extends RecaptchaDto {
  title: string;
  text: string;
  public_post?: string;
}

export class PostDto {
  id: number;
  title: string;
  author: string;
  profile_image: string;
  created_at: number;
}

export class PostPreviewDto extends PostDto {
  preview: string;
}

export class PostDataDto extends PostDto {
  text: string;
}

export class GetPostPageDto {
  page: number;
}

export class GetPostDto {
  id: number;
}
