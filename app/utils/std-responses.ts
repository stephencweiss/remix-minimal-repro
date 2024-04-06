import { json } from "@remix-run/node";

export const stdResponse = {
  200: "Success",
  201: "Created",
  203: "Accepted",
  204: "No content",
  301: "Moved permanently",
  302: "Redirect",
  400: "Whoops! Looks like something's missing. Check your details and try again.",
  401: "It appears you're unauthorized to do that!",
  403: "You're forbidden from doing that!",
  404: "We went looking and couldn't find that! Are you sure you have the right details?",
  405: "That method isn't allowed!",
  409: "There was a conflict with the request! Please review the request and try again.",
  500: "Server error",
  501: "Not implemented",
};

export const createStdResponse = (status: keyof typeof stdResponse, statusText?: string) => {
  const text = statusText
    ? `${stdResponse[status]}: ${statusText}`
    : stdResponse[status];
  return new Response(text, { status });
};

export const createStdJson = (status: keyof typeof stdResponse, statusText?: string) => {
  const text = statusText
    ? `${stdResponse[status]}: ${statusText}`
    : stdResponse[status];
  return json({ error: text }, status);
};
