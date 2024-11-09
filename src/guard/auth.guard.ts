import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { IAuthorization } from 'src/types/auth';
import type { IRequest } from 'src/types/headers';
import { JwtService } from '@nestjs/jwt';
import typia from 'typia';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();
    const authorization = request.headers.authorization as string;
    const matched = typia.is<IAuthorization>({
      authorization,
    });
    if (!matched) return false;

    // Is bearer token?
    if (!authorization.startsWith('Bearer')) return false;
    const token = authorization.replace('Bearer', '').trim();
    // Is token not empty?
    if (!token) return false;
    try {
      const verify = this.jwtService.verify(token);
      // Is JWT Signature valid?
      if (!verify) return false;
      request.token = token;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  }
}
