import { MainController } from 'src/controller/main.controller';
import { MainService } from 'src/service/main/main.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
