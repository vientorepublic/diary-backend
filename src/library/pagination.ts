import { IPaginationData, IPaginationInfo } from '../types/pagination';

export class Pagination {
  public paginateData<T>(
    data: T[],
    page: number,
    pageSize: number,
  ): IPaginationData<T[]> {
    const totalItemCount = data.length;
    const lastPageNumber = Math.ceil(totalItemCount / pageSize);

    if (page < 1 || page > lastPageNumber) {
      return {
        data: [],
        pagination: {
          totalItemCount,
          lastPageNumber,
          currentPage: page,
          pageSize,
        },
      };
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = data.slice(startIndex, endIndex);

    const pagination: IPaginationInfo = {
      totalItemCount,
      lastPageNumber,
      currentPage: page,
      pageSize,
    };

    return {
      data: pageData,
      pagination,
    };
  }
}
