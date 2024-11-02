import { TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { PostPreviewDto } from 'src/dto/post.dto';
import { SearchQueryDto } from 'src/dto/search.dto';
import { SearchService } from 'src/service/search/search.service';
import { IPaginationData } from 'src/types/pagination';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @TypedRoute.Get()
  public async searchPost(
    @TypedQuery() query: SearchQueryDto,
  ): Promise<IPaginationData<PostPreviewDto[]>> {
    return this.searchService.searchPost(query);
  }
}
