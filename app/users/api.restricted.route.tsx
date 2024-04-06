import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import { Text } from "~/components/text";
import VisuallyHidden from "~/components/visually-hidden";
import { requireUserId } from "~/session.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = String(formData.get("action"));
  switch (request.method) {
    case "POST": {
      switch (action) {
        case "login-comment": {
          const redirectTo = String(formData.get("redirectTo"));
          return requireUserId(context.db, request, { redirectTo, path: "login" });
        }
        case "sign-up-comment": {
          const redirectTo = String(formData.get("redirectTo"));
          return requireUserId(context.db, request, { redirectTo, path: "join" });
        }
        default:
          throw new Response(`Unsupported action: ${action}`, { status: 400 });
      }
    }
    default:
      throw new Response(`Unsupported method: ${request.method}`, {status: 400});
  }
};

export const RequireAuthenticatedUser = ({
  message,
  redirectTo,
}: {
  message?: string;
  redirectTo?: string;
}) => {
  const loginFetcher = useFetcher({ key: "login-comment" });
  const signUpFetcher = useFetcher({ key: "signup-comment" });
  return (
    <div className="flex-1 justify-between">
      {message ? <Text className="py-4 px-2 block justify-center">{message}</Text> : <></>}

      <div className="flex gap-2 justify-center shrink-0">
        <signUpFetcher.Form method="post" action="/api/restricted">
          {redirectTo ? (
            <VisuallyHidden><input readOnly name="redirectTo" value={redirectTo} /></VisuallyHidden>
          ) : (
            <></>
          )}
          <VisuallyHidden><input readOnly name="action" value="sign-up-comment" /></VisuallyHidden>

          <button className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-600 active:bg-blue-400 focus:bg-blue-700 disabled:bg-gray-400">
            Sign Up
          </button>
        </signUpFetcher.Form>
        <loginFetcher.Form method="post" action="/api/restricted">
          {redirectTo ? (
            <VisuallyHidden><input readOnly name="redirectTo" value={redirectTo} /></VisuallyHidden>
          ) : (
            <></>
          )}

          <VisuallyHidden><input readOnly name="action" value="login-comment" /></VisuallyHidden>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-400 focus:bg-blue-700 disabled:bg-gray-400"
          >
            Login
          </button>
        </loginFetcher.Form>
      </div>
    </div>
  );
};
