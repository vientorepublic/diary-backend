import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Request } from '@nestjs/common';
import {
  IssueTokenResponse,
  LoginBodyDto,
  RegisterBodyDto,
} from 'src/dto/auth.dto';
import { MessageDto } from 'src/dto/message.dto';
import { LoginService } from 'src/service/auth/login.service';
import { RegisterService } from 'src/service/auth/register.service';
import { IRequest } from 'src/types/headers';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
  ) {}

  @TypedRoute.Post('login')
  public login(
    @Request() req: IRequest,
    @TypedBody() dto: LoginBodyDto,
  ): Promise<IssueTokenResponse> {
    return this.loginService.issueToken(req, dto);
  }

  @TypedRoute.Post('register')
  public register(
    @Request() req: IRequest,
    @TypedBody() dto: RegisterBodyDto,
  ): Promise<MessageDto> {
    return this.registerService.createAccount(req, dto);
  }
}
