import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftController } from 'src/controller/draft.controller';
import { DraftEntity } from 'src/entity/draft.entity';
import { UserEntity } from 'src/entity/user.entity';
import { DraftService } from 'src/service/draft/draft.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DraftEntity])],
  controllers: [DraftController],
  providers: [DraftService],
})
export class DraftModule {}
