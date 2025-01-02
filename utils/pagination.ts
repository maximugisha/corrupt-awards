import { Prisma } from '@prisma/client';

type PaginationParams = {
  page?: number;
  limit?: number;
};

type PaginationResult<T> = {
  count: number;
  pages: number;
  currentPage: number;
  data: T[];
};

// Define proper types for Prisma query arguments
type PrismaQueryArgs = {
  where?: Record<string, unknown>;
  skip?: number;
  take?: number;
  include?: Record<string, unknown>;
  orderBy?: Record<string, Prisma.SortOrder>;
};

// Define the structure that all Prisma models share
interface PrismaDelegate<T> {
  findMany(args: PrismaQueryArgs): Promise<T[]>;
  count(args: { where: Record<string, unknown> }): Promise<number>;
}

export async function paginate<T>(
  model: PrismaDelegate<T>,
  params: PaginationParams,
  queryParams: Omit<PrismaQueryArgs, 'skip' | 'take'> = {}
): Promise<PaginationResult<T>> {
  const { page = 1, limit = 10 } = params;
  const { where = {}, include = {}, orderBy = { createdAt: 'desc' } } = queryParams;

  const offset = (page - 1) * limit;

  const [data, count] = await Promise.all([
    model.findMany({
      where,
      skip: offset,
      take: limit,
      include,
      orderBy,
    }),
    model.count({ where }),
  ]);

  return {
    count,
    pages: Math.ceil(count / limit),
    currentPage: page,
    data,
  };
}