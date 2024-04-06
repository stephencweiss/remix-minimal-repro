import type { AppLoadContext } from '@remix-run/node';
import { expect, vi } from 'vitest'

import { defaultContext } from 'test/globals';
import { cleanDb } from '~/db/clean.server';
import { dbFactory , generateDatabaseUrl, prepareDB } from '~/db/db.server';
import { deleteDB } from '~/db/delete.server';
import { selectUserSchema } from '~/db/schema';
import { MinimalUser, SeedOptions } from '~/db/seed.server';

import { loader } from './user.$userId.profile.route'

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
  test('databases should be independent, i.e., previously created users should not be present in independent tests', async () => {
    // Test Arrange
    // This id is present in previous tests but is not seeded in _this_ test.
    const nonSeededUser = { id: '123' }
    const seedOptions: SeedOptions = { };
    const db = await prepareDB(dbPath, seedOptions);

    const context: AppLoadContext = {
      ...defaultContext,
      db,
    };
    const url = new URL(`http://localhost/user/${nonSeededUser.id}/profile`)
    const request = new Request(url) // mock the request
    const params = { userId: nonSeededUser.id }

    // Test Act
    const result = await loader({ context, params, request })
    const json = await result.json()

    // Test Assert
    expect(json.user).toBeUndefined();
  })
  test('should return a subsequent user object', async () => {
    // Test Arrange
    const testUser = { id: '1200', username: 'test', password: 'password', role: 'user' } as MinimalUser;
    const seedOptions: SeedOptions = { emailUsers: [testUser] };
    console.log(`dbPath: ${dbPath}`)
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
