
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

import { db } from "~/db/db.server";
import type { AllRoles, Role, User } from "~/db/schema";
import { userRoles as userRolesDB, roles } from "~/db/schema";
import { isNull } from "~/utils/list.utils";
import { findUniqueOrThrow } from "~/utils/query.utils";
import { createStdJson } from "~/utils/std-responses";

export type { InsertRole, Role } from "~/db/schema";;

export async function getRoleByName(name: Role["name"]): Promise<Role> {
  invariant(name, "Role name is required");
  return findUniqueOrThrow(await db.query.roles.findMany({
    where: eq(roles.name, name),
  }));
}

/**
 * @param userId
 * @returns roles: Role[]
 */
export async function getUserRolesById(userId: User["id"]): Promise<Role[]> {

  const results = await db.query.userRoles.findMany({
    where: eq(userRolesDB.userId, userId),
    with: { roles: true }
  })
  return results.map(ur => ur.roles).filter(isNull<Role>);
}

export async function validateUserIsAdmin(userId: User["id"]) {
  const userRoles = await getUserRolesById(userId);
  if (!userRoles.map(ur => ur.name).includes("admin")) {
    throw createStdJson(403);
  }
  return true;
}

/**
 * Sets a role for a user *without* checking if the requesting user is an admin.
 * This should only be called server side.
 * @param targetUserId
 * @param roleNames
 */
export async function unsafeSetRolesForUser(targetUserId: User["id"], roleNames: AllRoles[]) {
  // Parallelize fetching role records and creating user roles
  const rolePromises = roleNames.map(async (role) => {
    const roleRecord = await getRoleByName(role);
    if (!roleRecord) {
      return createStdJson(404, `Role ${role} not found`);
    }

    // Check to see if the user already has the role
    const existingUserRole = await db.query.userRoles.findFirst({
      where: (userRoles) => eq(userRoles.userId, targetUserId) && eq(userRoles.roleId, roleRecord.id),
    });
    if (existingUserRole) {
      throw createStdJson(409, `User ${targetUserId} already has role ${role}`);
    }

    // This operation does not depend on the result of any other in the loop.
    // Therefore it can be executed in parallel.
    const userRole = await db.insert(userRolesDB).values({
      userId: targetUserId,
      roleId: roleRecord.id,

    }).returning();
    return userRole;
  });

  // Await all promises from role processing
  const userRoles = await Promise.all(rolePromises);
  return userRoles;
}

/**
 * Sets a role for a user *if* the requesting user is an admin
 * @example ("admin-user-id", "target-user-id", "admin") // sets the role of user 2 to admin
 * @example ("admin-user-id", "target-user-id", "not-a-role") // throws an error
 * TODO: ideally, we'd want the requesting user to be injected via middleware vs. passed in
 */
export async function setRolesForUser(requestingUserId: User["id"], targetUserId: User["id"], roleNames: AllRoles[]) {
  validateUserIsAdmin(requestingUserId);
  unsafeSetRolesForUser(targetUserId, roleNames);
}


export async function deleteRolesForUser(requestingUserId: User["id"], targetUserId: User["id"], roleNames: Role["name"][]) {
  validateUserIsAdmin(requestingUserId);

  // Parallelize fetching role records and deleting user roles
  const rolePromises = roleNames.map(async (role) => {
    const roleRecord = await getRoleByName(role);
    if (!roleRecord) {
      return createStdJson(404, `Role ${role} not found`);
    }

    // Check to see if the user already has the role
    const existingUserRole = await db.query.userRoles.findFirst({
      where: eq(userRolesDB.userId, targetUserId) && eq(userRolesDB.roleId, roleRecord.id),
    });
    // If the user does not have the role, there is nothing to delete
    if (!existingUserRole) {
      return;
    }

    // This operation does not depend on the result of any other in the loop.
    // Therefore it can be executed in parallel.
    const userRole = await db.delete(userRolesDB)
      .where(eq(userRolesDB.userId, targetUserId) && eq(userRolesDB.roleId, roleRecord.id)).returning();

    return userRole;
  });

  // Await all promises from role processing
  const userRoles = await Promise.all(rolePromises);
  return userRoles;
}