export interface IUserStats {
  postCount: number;
  lastActivityDate: number;
}

export class UserInfoDto {
  id: number;
  user_id: string;
  profile_image: string;
  permission: number;
  stats?: IUserStats;
}

export class MyInfoDto extends UserInfoDto {
  email: string;
}

export class UserQueryParams {
  id: string;
}
