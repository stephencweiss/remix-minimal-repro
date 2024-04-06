import { PaginationOptions } from "./server.types";

// The TAKE_ADJUSTMENT is a constant that is used to ensure that we always take
// slightly more than what is requested so that we can then determine if there
// are more records to be fetched.
const TAKE_ADJUSTMENT = 1

/**
 * This is a standard way to ensure that we always take slightly more than what
 * is requested so that we can then determine if there are more records to be
 * fetched.
 * It also converts pagination numbers to the take/skip format that is used by
 * Prisma.
 */
export function getPaginationOptions(options: Partial<PaginationOptions> | undefined): {take: number; skip: number; pageSize: number} {
  const originalOptions = { pageSize: 100, page: 0, ...options }
  const { page, pageSize } = originalOptions;

  const limit = pageSize + TAKE_ADJUSTMENT;
  const skip = Math.max((page - 1) * pageSize, 0); // Calculate offset
  return {
    take: limit,
    skip,
    pageSize,
  };
}
/**
 * This helper function is well paired with increasePageSize and creates a
 * standard result pair of `results` and `moreRecordsExist`.
 */
export function trimResultsToPageSize<T>(results: T[], pageSize: number): { results: T[]; moreRecordsExist: boolean; } {
  return {
    results: results.slice(0, pageSize),
    moreRecordsExist: results.length > pageSize,
  };
}
