export interface IAuthorization {
  authorization: string;
}

export interface JwtPayload {
  user_id: string;
  id: number;
}

export interface JwtDecodedPayload extends JwtPayload {
  iat: number;
  exp: number;
}

export interface IQueryParams {
  user_id?: string;
  email?: string;
}
