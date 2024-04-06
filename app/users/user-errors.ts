import { errorResponseBody } from "~/utils/errors";

import { UpdatableUserError, UpdatablePasswordError } from "./user.types";
import { isUpdatableUserErrorResponse, isUpdatablePasswordErrorResponse } from "./user.utils";

export const createUserJSONErrorResponse = (
  errorKey: string,
  errorMessage: string,
): UpdatableUserError => {
  const defaultUserErrors: UpdatableUserError["errors"] = {
    global: null,
    username: null,
    email: null,
    phoneNumber: null,
  };

  const errorBody = errorResponseBody<UpdatableUserError["errors"]>(defaultUserErrors, [
    { key: 'global', message: 'An error occurred' },
    { key: errorKey, message: errorMessage }
  ], 'UpdatableUserError')

  if (!isUpdatableUserErrorResponse(errorBody)) {
    throw new Error('Unexpected error type');
  }
  return errorBody;
};

export const createPasswordJSONErrorResponse = (
  errorKey: string,
  errorMessage: string,

): UpdatablePasswordError => {
  const defaultPasswordErrors: UpdatablePasswordError["errors"] = {
    global: null,
    password: null,
  };
  const errorBody = errorResponseBody(defaultPasswordErrors, [
    { key: 'global', message: 'An error occurred' },
    { key: errorKey, message: errorMessage }
  ])

  if (!isUpdatablePasswordErrorResponse(errorBody)) {
    throw new Error('Unexpected error type');
  }
  return errorBody;
};
