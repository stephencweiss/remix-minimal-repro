import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import * as schema from '~/db/schema'

const cleanupDatabase = (db: BetterSQLite3Database<typeof schema>) => {
  try {
    const users = db.delete(schema.users).run()
    console.log({ users })
    const recipes = db.delete(schema.recipes).run()
    console.log({ recipes })
    const tags = db.delete(schema.tags).run()
    console.log({ tags })
    const roles = db.delete(schema.roles).run()
    console.log({ roles })
  } catch (err) {
    console.error('Something went wrong...')
    console.error(err)
  }
}

export const cleanDb = (db: BetterSQLite3Database<typeof schema>) => {
  console.log('🧨 Started deleting the database...\n')
  cleanupDatabase(db)
  console.log('\n🧨 Done deleting the database successfully...\n')
}

