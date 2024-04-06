import type { Config } from 'drizzle-kit';

import { env } from 'env-variables';

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: env.databasePath,
  },
  verbose: true,
  strict: true,
} satisfies Config;
