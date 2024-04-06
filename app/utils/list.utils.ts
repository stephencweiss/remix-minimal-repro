import { isBefore, isDate } from 'date-fns'

import { isValidString } from './strings';

/**
 * A utility that compares two objects by name.
 * Can be configured to compare ascending or descending.
 * Sorts Ascending by default
 * Useful in Array.sort()
 * @example sortObjectsByName(a, b) // sorts ascending
 * @example sortObjectsByName(a, b, true) // sorts ascending
 * @example sortObjectsByName(a, b, false) // sorts descending
 */
export function compareByName<T extends { name?: string | null }>(
  a: T,
  b: T,
  asc = true,
): number {
  const multiple = asc ? 1 : -1;

  const aName = isValidString(a.name) ? a.name: "";
  const bName = isValidString(b.name) ? b.name: "";

  if (aName < bName) {
    return multiple * -1;
  }
  if (aName > bName) {
    return multiple * 1;
  }
  return 0;
}

export function compareByOrder<T extends { order?: number | null }>(
  a: T,
  b: T,
  asc = true,
): number {
  const multiple = asc ? 1 : -1;
  const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;

  if (aOrder < bOrder) {
    return multiple * -1;
  }
  if (aOrder > bOrder) {
    return multiple * 1;
  }
  return 0;
}

export function compareByDate<T extends Record<K, unknown>, K extends keyof T>(
  a: T,
  b: T,
  asc = true,
  key: K = "date" as K,
): number {
  const multiple = asc ? 1 : -1;
  const aDate = a[key];
  const bDate = b[key];
  if (!isDate(aDate)) {
    throw new Error(`${String(key)} is not a date on key ${JSON.stringify(a)}`);
  }
  if (!isDate(bDate)) {
    throw new Error(`${String(key)} is not a date on key ${JSON.stringify(b)}`);
  }

  if (isBefore(aDate, bDate)) {
    return multiple * -1;
  }
  if (isBefore(bDate, aDate)) {
    return multiple * 1;
  }
  return 0;
}

/**
 * A helper function to use with Typescript that ensures that if the value is
 * null or undefined, it will return false.
 * More importantly, however, it means that Typescript understands the entire
 * list is of type T.
 * @example const list: number[] = [1, 2, null].filter(isNull<number>); // list is now number[]
 */
export function isNull<T>(value: T|null|undefined): value is T {
  return value !== undefined && value !== null;
}
/** A helper function to handle asynchronous actions within a filter of a list */

export async function asyncFilter<T>(
  arr: T[],
  predicate: (arg: T) => Promise<boolean>
) {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}
/** A helper function to handle asynchronous actions within a map of a list */

export async function asyncMap<T>(arr: T[], predicate: (arg: T) => Promise<T>) {
  return Promise.all(arr.map(predicate));
}
