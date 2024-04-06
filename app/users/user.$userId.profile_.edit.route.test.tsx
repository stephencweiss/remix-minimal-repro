import type { AppLoadContext } from '@remix-run/node';
import { expect, vi } from 'vitest'

import { defaultContext } from 'test/globals';
import { cleanDb } from '~/db/clean.server';
import { dbFactory , generateDatabaseUrl, prepareDB } from '~/db/db.server';
import { deleteDB } from '~/db/delete.server';
import { selectUserSchema } from '~/db/schema';
import { MinimalUser, SeedOptions } from '~/db/seed.server';

import { loader } from './user.$userId.profile_.edit.route'

describe('loader', () => {
  let dbPath: string;
  beforeAll(() => {
    dbPath = generateDatabaseUrl();
  })

  afterEach(async () => {
    const db = dbFactory(dbPath)
    await cleanDb(db)
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await deleteDB()
  });

  test('should return a user object', async () => {
    // Test Arrange
    const testUser = { id: '123', username: 'test', password: 'password', role: 'user' } as MinimalUser;
    const seedOptions: SeedOptions = { emailUsers: [testUser] };
    const db = await prepareDB(dbPath, seedOptions);

    const context: AppLoadContext = {
      ...defaultContext,
      db,
    };
    const url = new URL(`http://localhost/user/${testUser.id}/profile`)
    const request = new Request(url) // mock the request
    const params = { userId: testUser.id }

    // Test Act
    const result = await loader({ context, params, request })
    const json = await result.json()

    // Test Assert
    const { success } = selectUserSchema.safeParse(json.user)
    expect(success).toBe(true);
  })
});
