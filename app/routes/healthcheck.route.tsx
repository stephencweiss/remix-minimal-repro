// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { count } from "drizzle-orm";

import { db } from "~/db/db.server";
import { users } from "~/db/schema";

export const loader = async () => {
  try {
    // if we can connect to the database then we're good.
    await Promise.all([
      db.select({count: count()}).from(users)
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
