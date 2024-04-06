import bcrypt from "bcryptjs";
import { eq, like } from "drizzle-orm";
import invariant from "tiny-invariant";

import { db, type DBConnection } from "~/db/db.server";
import { type InsertPassword, type Password, type InsertUser, type User, users, passwords, userRoles, roles } from "~/db/schema";
import { validateUserIsAdmin } from "~/role/role.server";
import { toISO8601Now } from "~/utils/dates";
import { findFirst, findFirstOrThrow } from "~/utils/query.utils";
import { createStdResponse } from "~/utils/std-responses";
import { isValidString } from "~/utils/strings";

import { createPasswordJSONErrorResponse, createUserJSONErrorResponse } from "./user-errors";
import { UpdatablePasswordError, UpdatableUserError } from "./user.types";
import { isValidSearchMode } from "./user.utils";
import { isFieldValueAvailable } from "./user.utils.server";

export type { InsertUser, User } from "~/db/schema";

export async function getUserById(db: DBConnection, id: User["id"]) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function getUserByEmail(email: User["email"]) {
  invariant(email, "Email is required");
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserByUsername(username: User["username"]) {
  invariant(username, "Email is required");
  return await db.query.users.findFirst({
    where: eq(users.username, username),
  });
}

export async function searchUsers(searchTerm: string, mode?: string): Promise<User[]> {
  if (!isValidString(searchTerm)) {
    return [];
  }

  if (!isValidSearchMode(mode) && !isValidString(mode)) {
    throw createStdResponse(400, "Invalid search mode");
  }

  switch (mode) {
    case 'username':
      return await searchUsersByUsername(searchTerm);
    case 'email':
      return await searchUsersByEmail(searchTerm);
    default: {
      const combined = [...await searchUsersByEmail(searchTerm), ...await searchUsersByUsername(searchTerm)];
      const map = new Map<string, User>();
      for (const item of combined) {
        if (!map.has(item.id)) {
          map.set(item.id, item);    // set any value to Map
        }
      }
      return [...map.values()]
    }
  }
}

export async function searchUsersByUsername(username: User["username"]): Promise<User[]> {
  if (!username) {
    return [];
  }
  return await db.query.users.findMany({
    where: like(users.username, `"%${username}%"`),
  });
}

export async function searchUsersByEmail(email: User["email"]): Promise<User[]> {
  if (!email) {
    return [];
  }
  return await db.query.users.findMany({
    where: like(users.email, `"%${email}%"`),
  });
}

export async function createUserPassword(
  userId: User["id"],
  password: InsertPassword["encryptedPassword"],
): Promise<null> {
  if (!isValidString(password)) {
    throw createStdResponse(400, "Cannot create user")
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(passwords).values({ userId, encryptedPassword: hashedPassword });
  return null;
}

export async function createUsernameUser(username: InsertUser["username"], password: string): Promise<User> {
  if (!username) {
    throw createStdResponse(400, "Cannot create user");
  }

  const maybeExistingUser = await getUserByUsername(username);
  if (maybeExistingUser) {
    throw createStdResponse(400, "User already exists");
  }

  const insertUser: InsertUser = {
    username: username,
  };

  try {
    return await db.transaction(async (tx) => {
      const user = findFirstOrThrow<User>(await tx.insert(users).values(insertUser).returning());
      const userRole = await tx.query.roles.findFirst({ where: eq(roles.name, 'user') })
      if (!userRole) {
        throw createStdResponse(500, "Error creating user");
      }
      await tx.insert(userRoles).values({ userId: user.id, roleId: userRole.id });
      await tx.insert(passwords).values({ userId: user.id, encryptedPassword: await bcrypt.hash(password, 10) });
      return user;
    })
  } catch (error) {
    throw createStdResponse(500, "Error creating user");
  }
}

export async function createEmailUser(email: InsertUser["email"], password: string): Promise<User> {
  if (!email) {
    throw createStdResponse(400, "Cannot create user");
  }

  const maybeExistingUser = await getUserByEmail(email);
  if (maybeExistingUser) {
    throw createStdResponse(400, "User already exists");
  }

  const insertUser: InsertUser = {
    email,
    username: email,
  };
  try {
    return await db.transaction(async (tx) => {
      const user = findFirstOrThrow<User>(await tx.insert(users).values(insertUser).returning());
      const userRole = await tx.query.roles.findFirst({ where: eq(roles.name, 'user') })
      if (!userRole) {
        throw createStdResponse(500, "Error creating user");
      }
      await tx.insert(userRoles).values({ userId: user.id, roleId: userRole.id });
      await tx.insert(passwords).values({ userId: user.id, encryptedPassword: await bcrypt.hash(password, 10) });
      return user;
    })
  } catch (error) {
    throw createStdResponse(500, "Error creating user");
  }
}

export async function updateUserPassword(
  userId: User["id"],
  password: InsertPassword["encryptedPassword"],
): Promise<unknown | UpdatablePasswordError> {
  if (!isValidString(password)) {
    return createPasswordJSONErrorResponse("password", "Password is required")
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.update(passwords).set({ encryptedPassword: hashedPassword }).where(eq(passwords.userId, userId));
  return {};
}

export async function deleteUserByEmail(email: User["email"]) {
  if (!email) {
    throw createStdResponse(400, "Cannot delete user by email if email is missing");
  }
  return db.delete(users).where(eq(users.email, email));
}

export async function deleteUserByUsername(username: User["username"]) {
  return db.delete(users).where(eq(users.username, username));
}

export async function verifyUsernameLogin(
  username: User["username"],
  password: Password["encryptedPassword"],
) {
  if (!username || !password) {
    return null;
  }
  const userWithPassword = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      password: true,
    },
  });

  if (!userWithPassword?.password) {
    return null;
  }

  const isValid = bcrypt.compareSync(
    password,
    userWithPassword.password?.encryptedPassword ?? "",
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

export async function verifyEmailLogin(
  email: User["email"],
  password: Password["encryptedPassword"],
) {
  if (!email || !password) {
    return null;
  }
  const userWithPassword = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      password: true,
    }
  });
  if (!isValidString(userWithPassword?.password?.encryptedPassword)) {
    return null;
  }

  const isValid = bcrypt.compareSync(
    password,
    userWithPassword.password?.encryptedPassword ?? "",
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}


export async function updateUser(user: Partial<User> & { id: User["id"] }, requestingUserId: User["id"]
): Promise<Pick<User, "id"> | UpdatableUserError> {
  const { id, ...data } = user

  const requesterIsAdmin = await validateUserIsAdmin(requestingUserId);
  if (id !== requestingUserId && !requesterIsAdmin) {
    throw createStdResponse(403);
  }

  const { email, phoneNumber, username } = data;
  if (email && !(await isFieldValueAvailable("email", email, id))) {
    return createUserJSONErrorResponse("email", "Email is already taken");
  }
  if (phoneNumber && !(await isFieldValueAvailable("phoneNumber", phoneNumber, id))) {
    return createUserJSONErrorResponse("phoneNumber", "Phone number is already taken")

  }
  if (username && !(await isFieldValueAvailable("username", username, id))) {
    return createUserJSONErrorResponse("username", "Username is already taken")
  }

  const updatedUser = findFirst(await db.update(users).set({ ...data, updatedDate: toISO8601Now() }).where(eq(users.id, id)).returning({ id: users.id }));
  invariant(updatedUser, "User not found");
  return { id: updatedUser.id };
}
