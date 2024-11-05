import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationData } from 'src/types/pagination';
import { SearchQueryDto } from 'src/dto/search.dto';
import { PostEntity } from 'src/entity/post.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Pagination } from 'src/library/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { PostPreviewDto } from 'src/dto/post.dto';
import { Korean } from 'src/constant/locale';
import { Repository } from 'typeorm';

const pageSize = 6;
const paginator = new Pagination();

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async searchPost(
    dto: SearchQueryDto,
  ): Promise<IPaginationData<PostPreviewDto[]>> {
    const { type, page, sort, query } = dto;
    const data: PostPreviewDto[] = [];
    const sqlQuery = await this.postRepository
      .createQueryBuilder('posts')
      .where(`${type} LIKE :prefix`, { prefix: `%${query}%` })
      .orderBy('id', sort === 'latest' ? 'DESC' : 'ASC')
      .getMany();
    for (let i = 0; i < sqlQuery.length; i++) {
      if (sqlQuery[i].public_post) {
        const publisher = await this.userRepository.findOne({
          where: {
            user_id: sqlQuery[i].user_id,
          },
        });
        const profileImage = publisher ? publisher.profile_image : '';
        data.push({
          id: sqlQuery[i].id,
          title: sqlQuery[i].title,
          preview: sqlQuery[i].preview,
          author: sqlQuery[i].user_id,
          profile_image: profileImage,
          created_at: Number(sqlQuery[i].created_at),
          edited_at: Number(sqlQuery[i].edited_at),
        });
      }
    }
    if (!data.length) {
      throw new NotFoundException(Korean.NO_SEARCH_RESULT);
    }
    const pagination = paginator.paginateData(data, page, pageSize);
    return pagination;
  }
}
