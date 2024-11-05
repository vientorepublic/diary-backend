import { SearchController } from 'src/controller/search.controller';
import { SearchService } from 'src/service/search/search.service';
import { PostEntity } from 'src/entity/post.entity';
import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
