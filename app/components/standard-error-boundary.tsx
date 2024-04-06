import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

import { isValidString } from "~/utils/strings";

import { stdResponse } from "../utils/std-responses";

import { Text } from "./text";

const errorClass = "text-red-700 font-semibold";

export function StandardErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <Text className={errorClass} TagName="header">
        An unexpected error occurred: {error.message}
      </Text>
    );
  }

  if (!isRouteErrorResponse(error)) {
    return (
      <Text TagName="h1" className={errorClass}>
        {stdResponse[500]}
      </Text>
    );
  }

  const statusCode = error.status as keyof typeof stdResponse;

  if (isValidString(stdResponse[statusCode])) {
    return (
      <Text className={errorClass} TagName="header">
        {isValidString(error.data) ? error.data : stdResponse[statusCode]}
      </Text>
    );
  }

  return (
    <Text className={errorClass} TagName="header">
      An unexpected error occurred
      {isValidString(error.statusText) ? ": " + error.statusText : ""}
    </Text>
  );
}
