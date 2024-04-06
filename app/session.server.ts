import { createCookieSessionStorage, redirect } from "@remix-run/node";

import {env } from "env-variables";
import type { DBConnection } from "~/db/db.server";
import type { User } from "~/db/schema";
import { getUserById } from "~/users/user.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.sessionSecret],
    secure: env.environment=== "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  db: DBConnection,
  request: Request,
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(db: DBConnection, request: Request) {
  const userId = await getUserId(db, request);
  if (userId === undefined) return null;

  const user = await getUserById(db, userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  db: DBConnection,
  request: Request,
  options: { redirectTo?: string, path?: 'login' | 'join' } = {}
) {
  const userId = await getUserId(db, request);
  const {
    redirectTo = new URL(request.url).pathname,
    path = 'login' } = options;

  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/${path}?${searchParams}`);
  }
  return userId;
}

export async function requireUser(db: DBConnection,request: Request) {
  const userId = await requireUserId(db, request);

  const user = await getUserById(db, userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
