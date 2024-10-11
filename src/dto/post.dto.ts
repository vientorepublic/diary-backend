import { RecaptchaDto } from './recaptcha.dto';

export class PostBodyDto extends RecaptchaDto {
  title: string;
  text: string;
  public_post: boolean;
}

export class EditPostDto extends RecaptchaDto {
  id: number;
  title: string;
  text: string;
  public_post: boolean;
}

export class DraftBodyDto {
  title: string;
  text: string;
}

export class LoadDraftDto extends DraftBodyDto {}

export class PostDto {
  id: number;
  title: string;
  author: string;
  profile_image: string;
  created_at: number;
  edited_at?: number;
}

export class PostPreviewDto extends PostDto {
  preview: string;
}

export class MyPostsDto extends PostDto {
  public_post: boolean;
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
