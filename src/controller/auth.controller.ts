import { RegisterService } from 'src/service/auth/register.service';
import { VerifyService } from 'src/service/auth/verify.service';
import { LoginService } from 'src/service/auth/login.service';
import type { MessageDto } from 'src/dto/message.dto';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Request } from '@nestjs/common';
import type { IRequest } from 'src/types/headers';
import type {
  IdentifierDto,
  IssueTokenResponse,
  LoginBodyDto,
  RegisterBodyDto,
} from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly verifyService: VerifyService,
  ) {}

  @TypedRoute.Post('login')
  public async login(
    @Request() req: IRequest,
    @TypedBody() dto: LoginBodyDto,
  ): Promise<IssueTokenResponse> {
    return this.loginService.createJWT(req, dto);
  }

  @TypedRoute.Post('register')
  public async register(
    @Request() req: IRequest,
    @TypedBody() dto: RegisterBodyDto,
  ): Promise<MessageDto> {
    return this.registerService.createAccount(req, dto);
  }

  @TypedRoute.Post('verify')
  public async processVerify(
    @TypedBody() dto: IdentifierDto,
  ): Promise<MessageDto> {
    return this.verifyService.processVerify(dto);
  }
}
