import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3'
import invariant from "tiny-invariant";

import { env } from 'env-variables';
import { singleton } from "~/singleton.server";

import * as schema from "./schema";

const dbPath = env.databasePath;

const dbFactory = (connectionString?: string) => {
  invariant(connectionString, 'Connection string cannot be null');
  const client = Database(connectionString);
  // use sqlite pragma. recommended from https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
  client.pragma('journal_mode=WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
  client.pragma('synchronous=normal')
  client.pragma('foreign_keys=on')
  return drizzle(client, { schema });
}
const db = singleton("drizzle", () => dbFactory(dbPath));

export type DBConnection = typeof db;
export { db, dbFactory };
