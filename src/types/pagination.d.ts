export interface IPaginationInfo {
  totalItemCount: number;
  lastPageNumber: number;
  currentPage: number;
  pageSize: number;
}

export interface IPaginationData<T> {
  data: T;
  pagination: IPaginationInfo;
}
