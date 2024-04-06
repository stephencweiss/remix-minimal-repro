import { stripHtml } from "string-strip-html";

export const isValidString = (str: unknown): str is string => typeof str == 'string' && str.trim().length > 0

/**
 * A simple function to remove text in parentheses from a string.
 * @example "1/2 (and 1.5 here)" --> "1/2"
 * @example "1/2 (and 1.5 here), and 2.5 here" --> "1/2 , and 2.5 here"
 */
export const removeTextInParentheses = (raw: string) => {
  return raw.replace(/\([^)]*\)/g, '');
}

/**
 * A function to remove extra spaces from a string.
 * @example " 1/2  ,  and 2.5 here. " --> "1/2, and 2.5 here."
 */
export const removeExtraSpaces = (raw: string) => {
  // Remove spaces before punctuation
  raw = raw.replace(/\s+([,.!?;:])/, '$1');

  // Remove spaces after punctuation if it's not followed by a letter or number
  raw = raw.replace(/([,.!?;:])\s+(?![a-zA-Z0-9])/, '$1');

  // Replace multiple spaces with a single space
  raw = raw.replace(/\s{2,}/g, ' ');

  return raw.trim();
}

/**
 * Truncate a string to a maximum length and add an ellipsis if it's longer than
 * the maximum length.
 */
export const truncateString = ( str: string, maxLength: number) => {
  if (!str) {
    return "No Description";
  }
  if (str.length > maxLength) {
    return `${str?.substring(0, maxLength)}...`;
  }

  return str;
};

/**
 * Given a FormData object and a key, return the string value of the key.
 * If the key is not found, return an empty string.
 */
export const getStringFromForm = (formData: FormData, key: string): string => {
  return stripHtml(String(formData.get(key)??"")).result
}