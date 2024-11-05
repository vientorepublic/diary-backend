import { MainService } from 'src/service/main/main.service';
import type { MessageDto } from 'src/dto/message.dto';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get()
  public getHello(): MessageDto {
    return this.mainService.getHello();
  }
}
