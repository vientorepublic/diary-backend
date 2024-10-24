import type { UserInfoDto, UserQueryParams } from 'src/dto/user.dto';
import type { IRequest } from 'src/types/headers';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountService } from 'src/service/user/account.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { TypedQuery, TypedRoute } from '@nestia/core';

@Controller('auth/user')
export class UserController {
  constructor(private readonly accountService: AccountService) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  public async getMyInfo(@Request() req: IRequest): Promise<UserInfoDto> {
    return this.accountService.getMyInfo(req);
  }

  @TypedRoute.Get('userProfile')
  public async getUserInfo(@TypedQuery() query: UserQueryParams) {
    return this.accountService.getUserInfo(query);
  }
}
