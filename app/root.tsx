import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
} from "@remix-run/react";

// https://remix.run/docs/en/main/future/vite#fix-up-css-imports
import "~/tailwind.css";
import "~/global.css";
import { getUser } from "./session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return json({ user: await getUser(context.db, request) });
};

export default function App() {
  return (
    <html lang="en" className="h-dvh bg-zinc-900 w-screen text-zinc-50">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0,viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body className="size-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        {/* {env.environment === "production" ? (
          <script
            src="https://cdn.usefathom.com/script.js"
            data-site="ZLKXCGUA"
            defer
          ></script>
        ) : null} */}
        {/* <!-- / Fathom --> */}
      </body>
    </html>
  );
}
