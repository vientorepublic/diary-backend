import type { MessageDto } from 'src/dto/message.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MainService {
  public getHello(): MessageDto {
    return {
      message: 'Hello World!',
    };
  }
}
