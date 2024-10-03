import { Controller, Get } from '@nestjs/common';
import { MessageDto } from 'src/dto/message.dto';
import { MainService } from 'src/service/main/main.service';

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get()
  public getHello(): MessageDto {
    return this.mainService.getHello();
  }
}
