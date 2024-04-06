import { SearchMode, UpdatablePasswordError, UpdatableUserError } from "./user.types";

export const isUpdatableUserErrorResponse = (
  actionData?: unknown | UpdatableUserError,
): actionData is UpdatableUserError => {
  return ((actionData ?? {}) as UpdatableUserError).type === 'UpdatableUserError';
};

export const isUpdatablePasswordErrorResponse = (
  actionData?: unknown | UpdatablePasswordError,
): actionData is UpdatablePasswordError => {
  return ((actionData ?? {}) as UpdatablePasswordError).type === 'UpdatablePasswordError';
};

export const isValidSearchMode = (mode?: string): mode is SearchMode => {
  return mode === 'username' || mode === 'email';
}