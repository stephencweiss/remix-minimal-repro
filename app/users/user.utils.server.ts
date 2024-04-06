import { eq, ne } from "drizzle-orm";

import { db } from "~/db/db.server";
import { User } from "~/db/schema";
import { isValidString } from "~/utils/strings";

/**
 * On the User model, there are a few fields that *should* be unique, but we
 * cannot enforce all at the database level because some are also optional.
 *
 * These fields are:
 * - email (optional)
 * - phone (optional)
 * - username (required; enforced at the db level)
 *
 * This function checks to see if a user with the desired value for the field
 * already exists.
 *
 * @example isFieldValueAvailable('email', 'foo@gmail.com', '123') // true if no user with email 'foo@gmail.com' exists or that user is the one with id '123'
 * @param field
 * @param desiredValue
 * @returns
 */
export const isFieldValueAvailable = async (field: keyof User, desiredValue: string, id: User["id"]) => {
  // If the desired value is an empty string, then it is available - since this
  // is equivalent to "not set".
  if (!isValidString(desiredValue)) {
    return true;
  }
  const existingUser = await db.query.users.findFirst({
    where: (users) => eq(users[field], desiredValue) && ne(users.id, id)
  });

  // If no user found, then we know the field *is* available.
  return existingUser === null
}