import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountService } from 'src/service/user/account.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { IRequest } from 'src/types/headers';
import { UserInfoDto } from 'src/dto/user.dto';

@Controller('auth/user')
export class UserController {
  constructor(private readonly accountService: AccountService) {}

  @Get('info')
  @UseGuards(AuthGuard)
  public getUserInfo(@Request() req: IRequest): Promise<UserInfoDto> {
    return this.accountService.getUserInfo(req);
  }
}
