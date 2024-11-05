import { SearchService } from 'src/service/search/search.service';
import { IPaginationData } from 'src/types/pagination';
import { TypedQuery, TypedRoute } from '@nestia/core';
import { SearchQueryDto } from 'src/dto/search.dto';
import { PostPreviewDto } from 'src/dto/post.dto';
import { Controller } from '@nestjs/common';

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
