export type PostSearchTypes = 'title' | 'text' | 'user_id';

export class SearchQueryDto {
  type: PostSearchTypes;
  page: number;
  query: string;
}
