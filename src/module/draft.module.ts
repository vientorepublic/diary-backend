import { DraftController } from 'src/controller/draft.controller';
import { DraftService } from 'src/service/draft/draft.service';
import { DraftEntity } from 'src/entity/draft.entity';
import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DraftEntity])],
  controllers: [DraftController],
  providers: [DraftService],
})
export class DraftModule {}
