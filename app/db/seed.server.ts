import bcrypt from "bcryptjs";
import { eq, inArray } from "drizzle-orm";
import { type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import invariant from "tiny-invariant";

import { env } from 'env-variables';

import type { AllRoles } from './schema';
import * as schema from "./schema";
import { roles as rolesSchema, users } from "./schema";

export interface MinimalUser { id?: string; username: string; password: string; email?: string; role: AllRoles };

async function createRoles(db: BetterSQLite3Database<typeof schema>) {
  const roles: AllRoles[] = ['user', 'admin'];
  await db.insert(rolesSchema).values(roles.map(r => ({ name: r }))).returning();
}

async function createUsers(db: BetterSQLite3Database<typeof schema>, seededUsers: MinimalUser[]) {

  return await db.transaction(async tx => {
    const insertedUsers = await tx.insert(users).values(seededUsers.map(u => {
      const { id, ...rest } = u;
      if (id) {
        return ({ id, ...rest });
      }
      return rest;
    }
    )).returning();
    const hashedPasswords = await Promise.all(insertedUsers.map(async iu => {
      const pw = seededUsers.find(u => u.username === iu.username)?.password;
      invariant(pw, `Password required; not found for ${iu.username}`);
      return ({ id: iu.id, password: await bcrypt.hash(pw, 10) });
    }));

    await tx.insert(schema.passwords).values(hashedPasswords.map(hp => ({ userId: hp.id, encryptedPassword: hp.password }))).returning();

    const userRoles = await Promise.all(insertedUsers.map(async iu => {
      const userRole = seededUsers.find(u => u.username === iu.username)?.role;
      invariant(userRole, `Role required; not found for ${iu.username}`);
      const r = await tx.query.roles.findFirst({ where: eq(rolesSchema.name, userRole) });
      invariant(r, `Role not found for ${iu.username}`);
      return ({ userId: iu.id, roleId: r.id });
    }));
    await tx.insert(schema.userRoles).values(userRoles.map(ur => ({ userId: ur.userId, roleId: ur.roleId })));
    return insertedUsers;
  })

}

const recipeData = [
  {
    title: "Pumpkin Pie",
    description: "A delicious pumpkin pie recipe",
    preparationSteps:
      '["Preheat oven to 425 F.","Whisk pumpkin, sweetened condensed milk, eggs, spices and salt in medium bowl until smooth.","Pour into crust. Bake 15 minutes.","Reduce oven temperature to 350 F and continue baking 35 to 40 minutes or until knife inserted 1 inch from crust comes out clean.","Cool. Garnish as desired. Store leftovers covered in refrigerator."]',
    source: "NYTimes Cooking",
    sourceUrl: "https://cooking.nytimes.com/recipes/1015622-pumpkin-pie",
    recipeIngredients: [
      {
        name: "pumpkin puree",
        quantity: '15',
        unit: "oz",
      },
      {
        name: "sweetened condensed milk",
        quantity: '14',
        unit: "oz",
      },
      {
        name: "eggs",
        quantity: '2',
        unit: "",
      },
      {
        name: "pumpkin pie spice",
        quantity: '1/3',
        unit: "tbsp",
      },
      {
        name: "pie crust",
        quantity: '1',
        unit: "whole",
      },],
    tags: ["pumpkin", "pie", "dessert", "thanksgiving", "baking"],
  },
  {
    title: 'Caeasar Salad',
    description: 'A delicious caesar salad recipe',
    preparationSteps:
      '["In a large wooden salad bowl, rub the inside with the garlic clove, then discard. Add the lettuce, croutons, and cheese. Set aside.","In a small bowl, whisk together the lemon juice, olive oil, salt, pepper, egg yolk, mustard, and anchovy paste. Pour over the lettuce in the salad bowl, and toss well.","Serve immediately."]',
    source: "NYTimes Cooking",
    sourceUrl: "https://cooking.nytimes.com/recipes/1017937-caesar-salad",
    recipeIngredients: [
      {
        name: "romaine lettuce",
        quantity: '1',
        unit: "head",
      },
      {
        name: "croutons",
        quantity: '1',
        unit: "cup",
      },
      {
        name: "parmesan cheese",
        quantity: '1',
        unit: "cup",
      },
      {
        name: "lemon juice",
        quantity: '1',
        unit: "tbsp",
      },
      {
        name: "olive oil",
        quantity: '1',
        unit: "tbsp",
      },
      {
        name: "garlic",
        quantity: '1',
        unit: "clove",
      },
      {
        name: "salt",
        quantity: '1',
        unit: "tsp",
      },
      {
        name: "pepper",
        quantity: '1',
        unit: "tsp",
      },
      {
        name: "egg yolk",
        quantity: '1',
        unit: "",
      },
      {
        name: "dijon mustard",
        quantity: '1',
        unit: "tsp",
      },
      {
        name: "anchovy paste",
        quantity: '1/4',
        unit: "cup",
      },
    ],
    tags: ["salad", "dinner", "lunch", "vegetarian"],
  }
]

async function insertRecipes(db: BetterSQLite3Database<typeof schema>, recipes: typeof recipeData, users: Pick<schema.User, 'id'>[]) {
  await db.transaction(async tx => {
    const insertedRecipes = await tx.insert(schema.recipes).values(recipes.map((r, i) => {
      const submitter = users[i % 2]
      return ({
        title: r.title,
        description: r.description,
        preparationSteps: r.preparationSteps,
        source: r.source,
        sourceUrl: r.sourceUrl,
        submittedBy: submitter.id
      })
    })).returning();

    const enrichedRecipes = recipes.map(r => {
      const recipeId = insertedRecipes.find(ir => ir.title === r.title)?.id;
      if (!recipeId) {
        throw new Error(`Recipe not found for ${r.title}`);
      }
      return { ...r, id: recipeId }
    })

    const recipeIngredients = enrichedRecipes.map(r => r.recipeIngredients.map(i => ({ recipeId: r.id, ...i }))).flat();
    await tx.insert(schema.recipeIngredients).values(recipeIngredients).returning();

    const tags = enrichedRecipes.map(r => r.tags.map(t => ({ name: t, recipeId: r.id }))).flat();
    const insertedTags = await tx.insert(schema.tags).values(tags).returning();
    const recipeTags = enrichedRecipes.map(r =>
      r.tags.map(t => ({
        recipeId: r.id,
        tagId: insertedTags.find(it => it.name === t)?.id
      }))
        .filter(t => t.tagId))
      .flat()
    await tx.insert(schema.recipeTags).values(recipeTags);
  })
}

/**
 * This is a quick check to see if we need to seed the database.
 * The assumption is that if the users are already in the database, then the database is already seeded.
 */
async function isSeeded(db: BetterSQLite3Database<typeof schema>, seededUsers: MinimalUser[]): Promise<boolean> {
  try {
    const existingUsers = await db.query.users.findMany({ where: inArray(users.username, seededUsers.map(u => u.username)) });
    if (existingUsers.length > 0) {
      return true;
    }
    return false;
  } catch (e: unknown) {
    const err = e as Error;
    console.error(`Error checking if database is seeded: ${err.message}`);
    throw err;
  }
}


export interface SeedOptions {
  adminUsers?: MinimalUser[];
  emailUsers?: MinimalUser[];
  recipes?: (typeof recipeData);
}

export async function seed(db: BetterSQLite3Database<typeof schema>, options?: SeedOptions) {
  const adminPassword = env.adminPassword;
  /** Prep data */
  const emailUsers = [
    { username: "rachel@remix.run", email: "rachel@remix.run", password: "racheliscool" },
    { username: "kate@remix.run", email: "kate@remix.run", password: "katerox" },
    ...(options?.emailUsers ?? [])
  ].map(u => ({ ...u, role: 'user' as AllRoles }))
  const adminUsers = [{
    username: "stephen", password: adminPassword, role: "admin" as AllRoles
  }, ...(options?.adminUsers ?? [])]

  const seededUsers = [...emailUsers, ...adminUsers];

  console.log(`Starting database seeding. 🌱`);
  if (await isSeeded(db, seededUsers)) {
    console.log(`Database is already seeded. 🌳`);
    return;
  }

  console.log(`Seeding database... 🌱`)
  await createRoles(db)
  console.log(`Roles seeded. 🌱`);
  const users = await createUsers(db, seededUsers);
  console.log(`All users seeded. 🌱`);
  const recipes = [...recipeData, ...(options?.recipes ?? [])]
  insertRecipes(db, recipes, users);
  console.log(`Recipes seeded. 🌱`);
  console.log(`Database has been seeded. 🌳`);
}
