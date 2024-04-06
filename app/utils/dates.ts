import { formatISO, lightFormat, parseISO } from 'date-fns';

/**
 * Converts a Date object to an ISO8601 string.
 * @param date - The Date object to convert.
 * @returns An ISO8601 formatted string representing the date.
 * @example toISO8601(new Date('2022-01-01T00:00:00Z')) // '2022-01-01T00:00:00'
 */
export function toISO8601(date: Date): string {
  return formatISO(date);
}

/**
 * A helper function to get the current date in ISO8601 format.
 */
export function toISO8601Now(): string {
  return toISO8601(new Date());
}

/**
 * Converts an ISO8601 string to a Date object.
 * @param dateStr - The ISO8601 string to convert.
 * @returns A Date object representing the date.
 */
export function fromISO8601(dateStr: string): Date {
  return parseISO(dateStr);
}

type FormatStr = StdDateFormat | StdDateTimeFormat;
type StdDateFormat = 'yyyy-MM-dd'
type StdDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
export function formatDate(date: string | Date, formatStr: FormatStr): string {
  try {
    return lightFormat(date, formatStr);
  } catch (e) {
    throw new Error(`Invalid date ${date}`);
  }
}