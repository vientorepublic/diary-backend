export class UserInfoDto {
  id: number;
  user_id: string;
  profile_image: string;
  permission: number;
}

export class MyInfoDto extends UserInfoDto {
  email: string;
}

export class UserQueryParams {
  id: string;
}
