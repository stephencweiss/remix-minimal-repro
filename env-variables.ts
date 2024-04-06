/**
 * The purpose of this file is to ensure that we have a single place to look for
 * (and validate) all environment variables which are used in the app.
 * If the app will fail without the variable, we should use invariant to ensure
 * that it is set here and throw an error if it is not.
 * This will avoid cluttering the app with process.env calls and ensure that
 * the app will fail fast if a required environment variable is not set.
 */

import invariant from "tiny-invariant";

const MAYBE_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
invariant(MAYBE_ADMIN_PASSWORD, 'ADMIN_PASSWORD cannot be null');
const ADMIN_PASSWORD = MAYBE_ADMIN_PASSWORD;


const MAYBE_DATABASE_DIR = process.env.DATABASE_DIR;
invariant(MAYBE_DATABASE_DIR, 'DATABASE_DIR cannot be null');
const DATABASE_DIR = MAYBE_DATABASE_DIR

const MAYBE_DATABASE_FILE = process.env.DATABASE_FILE;
invariant(MAYBE_DATABASE_FILE, 'DATABASE_FILE cannot be null');
const DATABASE_FILE = MAYBE_DATABASE_FILE

const ENVIRONMENT = process.env.NODE_ENV;

const MAYBE_JWT_SECRET = process.env.JWT_SECRET;
invariant(MAYBE_JWT_SECRET, 'SESSION_SECRET cannot be null');
const JWT_SECRET = MAYBE_JWT_SECRET

const PORT = process.env.PORT

const MAYBE_SESSION_SECRET = process.env.SESSION_SECRET;
invariant(MAYBE_SESSION_SECRET, 'SESSION_SECRET cannot be null');
const SESSION_SECRET = MAYBE_SESSION_SECRET;

export const env = {
  adminPassword: ADMIN_PASSWORD,
  databaseDir: DATABASE_DIR,
  databasePath: `${DATABASE_DIR}/${DATABASE_FILE}`,
  environment: ENVIRONMENT,
  jwtSecret: JWT_SECRET,
  port: PORT,
  sessionSecret: SESSION_SECRET,
}