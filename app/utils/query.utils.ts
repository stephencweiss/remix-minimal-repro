/**
 * Requires that an array has exactly one element, otherwise throws an error.
 * @param array
 * @param message
 * @returns
 */
export function findUniqueOrThrow<T>(array: T[], message?: string): T {
  if (array.length !== 1) {
    throw new Error(message);
  }
  return array[0];
}

/** Gets the first element in an array or null */
export function findFirst<T>(array: T[]): T | null {
  return array[0] || null;
}

/**
 * Gets the first element in an array or throws an error if the array is empty.
 */
export function findFirstOrThrow<T>(array: T[], message?: string): T {
  if (array?.length < 1) {
    throw new Error(message);
  }
  return array[0];
}