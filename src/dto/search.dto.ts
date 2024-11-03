export type PostSearchTypes = 'title' | 'text' | 'user_id';
export type SortOptions = 'latest' | 'oldest';

export class SearchQueryDto {
  type: PostSearchTypes;
  page: number;
  sort: SortOptions;
  query: string;
}
