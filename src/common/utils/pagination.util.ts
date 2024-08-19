import { PaginationDto } from '../dto/pagination.dto';

export function PaginationSolver(data: PaginationDto) {
  let { page = 0, limit = 10 } = data;
  if (!page || page <= 1) page = 0;
  else page -= 1;
  if (!limit || limit <= 0) limit = 10;

  const skip = page * limit;
  return {
    page: page === 0 ? 1 : page,
    limit,
    skip,
  };
}

export function PaginationGenerator(
  count: number = 0,
  page: number = 0,
  limit: number = 0,
) {
  return {
    totalCount: count,
    page: +page,
    limit: +limit,
    pageCount: Math.ceil(count / limit),
  };
}
