import { UserEntity } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostEntity } from 'src/entity/post.entity';
import { PostController } from 'src/controller/post.controller';
import { PostService } from 'src/service/post/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
