import { createId } from '@paralleldrive/cuid2';
import { relations } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as z from 'zod';

// TODO: Make sure we have composite ids for any @@id fields from the prisma schema

import { toISO8601 } from '~/utils/dates';

/*
 * GITHUB CoPilot prompt for converting a Prisma model to a Drizzle model
 * Please convert this model into a Drizzle model using the `sqliteTable` function
 *
 * Pay attention to the following:
 * `id` - instead of the `uuid()`, we will us text('id').$default(() => createId()).primaryKey()
 * date fields - instead of `DateTime`, we will use text, e.g., text('created_date').$default(() => toISO8601(new Date()))
 * foreign relationships, including when they cascade, e.g., submittedBy: text('submitted_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
 */

export const users = sqliteTable('users', {
  id: text('id').$default(() => createId()).primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email'),
  phoneNumber: text('phoneNumber'),
  name: text('name'),
  status: text('status', { enum: ["pending", "active", "archived"] }).$default(() => "pending"),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
  lastLoginDate: text('last_login_date').$default(() => toISO8601(new Date())),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  auditLogs: many(auditLogs),
  collections: many(collections),
  collectionAccess: many(collectionAccess),
  cookLog: many(cookLog),
  comments: many(comments),
  eventGuests: many(eventGuests),
  events: many(events),
  menu: many(menus),
  password: one(passwords, { fields: [users.id], references: [passwords.userId] }),
  ratings: many(ratings),
  recipeRatings: many(recipeRatings),
  recipes: many(recipes),
  userRoles: many(userRoles),
  userInvites: many(userInvites, { relationName: 'inviter' }),
  invite: one(userInvites, { fields: [users.id], references: [userInvites.userId], relationName: 'invitee' }),
  userRecipeCollections: many(userRecipeCollections),
  userCookLogs: many(userCookLogs),
  tags: many(tags),
}));

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdDate: true, updatedDate: true, lastLoginDate: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;

export const comments = sqliteTable('comments', {
  id: text('id').$default(() => createId()).primaryKey(),
  submittedBy: text('submitted_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  comment: text('comment').notNull(),
  // TODO: Drop all the comment tables and use a single table with a type column
  // commentType: text('comment_type', {enum: ["event", "feedback", "menu", "menuCourse", "recipe", "useful"]}).notNull(),
  isPrivate: integer('is_private', { mode: 'boolean' }).$default(() => false),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  eventComments: many(eventComments),
  feedbackComments: many(feedbackComments),
  menuComments: many(menuComments),
  menuCourseComments: many(menuCourseComments),
  recipeComments: many(recipeComments),
  usefulComments: many(usefulComments),
  user: one(users, { fields: [comments.submittedBy], references: [users.id] }),
}));

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertComment = z.infer<typeof insertCommentSchema>;

export const selectCommentSchema = createSelectSchema(comments);
export type Comment = z.infer<typeof selectCommentSchema>;

export const eventComments = sqliteTable('event_comments', {
  eventId: text('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
});

export const eventCommentsRelations = relations(eventComments, ({ one }) => ({
  comment: one(comments, { fields: [eventComments.commentId], references: [comments.id] }),
  events: one(events, { fields: [eventComments.eventId], references: [events.id] }),
}));

export const insertEventCommentSchema = createInsertSchema(eventComments);
export type InsertEventComment = z.infer<typeof insertEventCommentSchema>;

export const selectEventCommentSchema = createSelectSchema(eventComments);
export type EventComment = z.infer<typeof selectEventCommentSchema>;

export const feedbackComments = sqliteTable('feedback_comments', {
  id: text('id').$default(() => createId()).primaryKey(),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
});

export const feedbackCommentsRelations = relations(feedbackComments, ({ one }) => ({
  comment: one(comments, { fields: [feedbackComments.commentId], references: [comments.id] }),
}));

export const insertFeedbackCommentSchema = createInsertSchema(feedbackComments).omit({ id: true });
export type InsertFeedbackComment = z.infer<typeof insertFeedbackCommentSchema>;

export const selectFeedbackCommentSchema = createSelectSchema(feedbackComments);
export type FeedbackComment = z.infer<typeof selectFeedbackCommentSchema>;

export const menuComments = sqliteTable('menu_comments', {
  menuId: text('menu_id').references(() => menus.id).notNull(),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.menuId, table.commentId] }),
}));

export const menuCommentsRelations = relations(menuComments, ({ one }) => ({
  comment: one(comments, { fields: [menuComments.commentId], references: [comments.id] }),
  menus: one(menus, { fields: [menuComments.menuId], references: [menus.id] }),
}));

export const insertMenuCommentSchema = createInsertSchema(menuComments);
export type InsertMenuComment = z.infer<typeof insertMenuCommentSchema>;

export const selectMenuCommentSchema = createSelectSchema(menuComments);
export type MenuComment = z.infer<typeof selectMenuCommentSchema>;

export const menuCourseComments = sqliteTable('menu_course_comments', {
  menuCourseId: text('menu_course_id').references(() => menuCourses.id, { onDelete: 'cascade' }).notNull(),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.menuCourseId, table.commentId] }),
}));

export const menuCourseCommentsRelations = relations(menuCourseComments, ({ one }) => ({
  comment: one(comments, { fields: [menuCourseComments.commentId], references: [comments.id] }),
  menuCourse: one(menuCourses, { fields: [menuCourseComments.menuCourseId], references: [menuCourses.id] }),
}));

export const insertMenuCourseCommentsSchema = createInsertSchema(menuCourseComments);
export type InsertMenuCourseComments = z.infer<typeof insertMenuCourseCommentsSchema>;

export const selectMenuCourseCommentsSchema = createSelectSchema(menuCourseComments);
export type MenuCourseComments = z.infer<typeof selectMenuCourseCommentsSchema>;

export const recipeComments = sqliteTable('recipe_comments', {
  recipeId: text('recipe_id').references(() => recipes.id).notNull(),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.recipeId, table.commentId] }),
}));

export const recipeCommentsRelations = relations(recipeComments, ({ one }) => ({
  comment: one(comments, { fields: [recipeComments.commentId], references: [comments.id] }),
  recipes: one(recipes, { fields: [recipeComments.recipeId], references: [recipes.id] }),
}));

export const insertRecipeCommentSchema = createInsertSchema(recipeComments);
export type InsertRecipeComment = z.infer<typeof insertRecipeCommentSchema>;

export const selectRecipeCommentSchema = createSelectSchema(recipeComments);
export type RecipeComment = z.infer<typeof selectRecipeCommentSchema>;

export const usefulComments = sqliteTable('useful_comments', {
  id: text('id').$default(() => createId()).primaryKey(),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const usefulCommentRelations = relations(usefulComments, ({ one }) => ({
  comment: one(comments, { fields: [usefulComments.commentId], references: [comments.id] }),
  user: one(users, { fields: [usefulComments.userId], references: [users.id] }),
}));

export const insertUsefulCommentSchema = createInsertSchema(usefulComments).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertUsefulComment = z.infer<typeof insertUsefulCommentSchema>;

export const selectUsefulCommentSchema = createSelectSchema(usefulComments);
export type UsefulComment = z.infer<typeof selectUsefulCommentSchema>;

export const events = sqliteTable('events', {
  id: text('id').$default(() => createId()).primaryKey(),
  name: text('name'),
  hostId: text('host_id').references(() => users.id).notNull(),
  eventDate: text('event_date'),
  location: text('location'),
  description: text('description'),
  menuId: text('menu_id').references(() => menus.id),
  isPrivate: integer('is_private', { mode: 'boolean' }).$default(() => true),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  modifiedDate: text('modified_date').$default(() => toISO8601(new Date())),
});
export const eventsRelations = relations(events, ({ one, many }) => ({
  eventComments: many(eventComments),
  eventGuests: many(eventGuests),
  menu: one(menus, { fields: [events.menuId], references: [menus.id] }),
  user: one(users, { fields: [events.hostId], references: [users.id] }),
}));

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdDate: true, modifiedDate: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;

export const selectEventSchema = createSelectSchema(events);
export type Event = z.infer<typeof selectEventSchema>;

export const eventGuests = sqliteTable('event_guests', {
  id: text('id').$default(() => createId()).primaryKey(),
  eventId: text('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name'),
  rsvp: text('rsvp', { enum: ["yes", "no", "maybe", "pending"] }).$default(() => "pending"),
  role: text('role', { enum: ["host", "guest", "chef"] }).$default(() => "guest"),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const eventGuestsRelations = relations(eventGuests, ({ one }) => ({
  event: one(events, { fields: [eventGuests.eventId], references: [events.id] }),
  user: one(users, { fields: [eventGuests.userId], references: [users.id] }),
}));

export const insertEventGuestSchema = createInsertSchema(eventGuests).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertEventGuest = z.infer<typeof insertEventGuestSchema>;

export const selectEventGuestSchema = createSelectSchema(eventGuests);
export type EventGuest = z.infer<typeof selectEventGuestSchema>;

// Inspiration
// https://schema.org/Menu
export const menus = sqliteTable('menus', {
  id: text('id').$default(() => createId()).primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: "cascade" }),
  name: text('name'),
  feedsNumPeople: integer('feeds_num_people'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const menusRelations = relations(menus, ({ one, many }) => ({
  events: many(events),
  menuComments: many(menuComments),
  menuCourses: many(menuCourses),
  menuRecipes: many(menuRecipes),
  menuTags: many(menuTags),
  user: one(users, { fields: [menus.userId], references: [users.id] }),
}));

export const insertMenuSchema = createInsertSchema(menus).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertMenu = z.infer<typeof insertMenuSchema>;

export const selectMenuSchema = createSelectSchema(menus);
export type Menu = z.infer<typeof selectMenuSchema>;

export const menuCourses = sqliteTable('menu_courses', {
  id: text('id').$default(() => createId()).primaryKey(),
  menuId: text('menu_id').references(() => menus.id, { onDelete: "cascade" }).notNull(),
  name: text('name'),
  description: text('description'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const menuCoursesRelations = relations(menuCourses, ({ one, many }) => ({
  menu: one(menus, { fields: [menuCourses.menuId], references: [menus.id] }),
  menuCourseComments: many(menuCourseComments),
  menuCourseTags: many(menuCourseTags),
  menuCourseRecipes: many(menuRecipes),
}));

export const insertMenuCourseSchema = createInsertSchema(menuCourses).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertMenuCourse = z.infer<typeof insertMenuCourseSchema>;

export const selectMenuCourseSchema = createSelectSchema(menuCourses);
export type MenuCourse = z.infer<typeof selectMenuCourseSchema>;

export const menuRecipes = sqliteTable('menu_recipes', {
  id: text('id').$default(() => createId()).primaryKey(),
  menuId: text('menu_id').references(() => menus.id, { onDelete: "cascade" }).notNull(),
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  addedBy: text('added_by').references(() => users.id),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
  menuCourseId: text('menu_course_id').references(() => menuCourses.id, { onUpdate: "cascade" }),
});

export const menuRecipesRelations = relations(menuRecipes, ({ one }) => ({
  menu: one(menus, { fields: [menuRecipes.menuId], references: [menus.id] }),
  recipe: one(recipes, { fields: [menuRecipes.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [menuRecipes.addedBy], references: [users.id] }),
  menuCourse: one(menuCourses, { fields: [menuRecipes.menuCourseId], references: [menuCourses.id] }),
  menuCourseRecipes: one(menuCourseRecipes, { fields: [menuRecipes.menuCourseId, menuRecipes.recipeId], references: [menuCourseRecipes.menuCourseId, menuCourseRecipes.menuRecipeId] }),
}));

export const insertMenuRecipeSchema = createInsertSchema(menuRecipes);
export type InsertMenuRecipe = z.infer<typeof insertMenuRecipeSchema>;

export const selectMenuRecipeSchema = createSelectSchema(menuRecipes);
export type MenuRecipe = z.infer<typeof selectMenuRecipeSchema>;

export const menuCourseRecipes = sqliteTable('menu_course_recipes', {
  menuCourseId: text('menu_course_id').references(() => menuCourses.id, { onDelete: "cascade" }).notNull(),
  menuRecipeId: text('recipe_id').references(() => menuRecipes.id, { onDelete: "cascade" }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.menuCourseId, t.menuRecipeId] }),
}));

export const menuCourseRecipesRelations = relations(menuCourseRecipes, ({ one }) => ({
  menuCourses: one(menuCourses, {
    fields: [menuCourseRecipes.menuCourseId],
    references: [menuCourses.id],
  }),
  menuRecipes: one(menuRecipes, {
    fields: [menuCourseRecipes.menuRecipeId],
    references: [menuRecipes.id],
  }),
}));

export const insertMenuCourseRecipeSchema = createInsertSchema(menuCourseRecipes);
export type InsertMenuCourseRecipe = z.infer<typeof insertMenuCourseRecipeSchema>;

export const selectMenuCourseRecipeSchema = createSelectSchema(menuCourseRecipes);
export type MenuCourseRecipe = z.infer<typeof selectMenuCourseRecipeSchema>;

export const recipeIngredients = sqliteTable('recipe_ingredients', {
  id: text('id').$default(() => createId()).primaryKey(),
  recipeId: text('recipe_id').references(() => recipes.id, { onUpdate: 'cascade', onDelete: "cascade" }).notNull(),
  name: text('name'),
  quantity: text('quantity'),
  unit: text('unit'),
  note: text('note'),
  rawIngredient: text('raw_ingredient'),
  order: integer('order'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeIngredients.recipeId], references: [recipes.id] }),
}));

export const insertRecipeIngredientsSchema = createInsertSchema(recipeIngredients).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertRecipeIngredient = z.infer<typeof insertRecipeIngredientsSchema>;

export const selectRecipeIngredientsSchema = createSelectSchema(recipeIngredients);
export type RecipeIngredient = z.infer<typeof selectRecipeIngredientsSchema>;

// TODO: Replace rating type tables with an enum for rating type
export const ratings = sqliteTable('ratings', {
  id: text('id').$default(() => createId()).primaryKey(),
  rating: integer('rating'),
  submittedBy: text('submitted_by').references(() => users.id, { onDelete: "cascade" }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, { fields: [ratings.submittedBy], references: [users.id] }),
}));

export const insertRatingsSchema = createInsertSchema(ratings).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertRating = z.infer<typeof insertRatingsSchema>;

export const selectRatingsSchema = createSelectSchema(ratings);
export type Rating = z.infer<typeof selectRatingsSchema>;

export const recipeRatings = sqliteTable('recipe_rating', {
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  ratingId: text('rating_id').references(() => ratings.id, { onDelete: "cascade" }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.recipeId, table.ratingId] }),
}));

export const recipeRatingsRelations = relations(recipeRatings, ({ one }) => ({
  rating: one(ratings, { fields: [recipeRatings.ratingId], references: [ratings.id] }),
  recipe: one(recipes, { fields: [recipeRatings.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [recipeRatings.userId], references: [users.id] }),
}));

export const insertRecipeRatingsSchema = createInsertSchema(recipeRatings);
export type InsertRecipeRating = z.infer<typeof insertRecipeRatingsSchema>;

export const selectRecipeRatingsSchema = createSelectSchema(recipeRatings);
export type RecipeRating = z.infer<typeof selectRecipeRatingsSchema>;

// TODO - Replace tags with a single table and a type column (enum)
export const tags = sqliteTable('tags', {
  id: text('id').$default(() => createId()).primaryKey(),
  name: text('name'),
  isPrivate: integer('is_private', { mode: 'boolean' }).$default(() => false),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  recipeTags: many(recipeTags),
  menuTags: many(menuTags),
  menuCourseTags: many(menuCourseTags),
  user: one(users, { fields: [tags.userId], references: [users.id] }),
}));

export const insertTagSchema = createInsertSchema(tags).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertTag = z.infer<typeof insertTagSchema>;

export const selectTagSchema = createSelectSchema(tags);
export type Tag = z.infer<typeof selectTagSchema>;

export const recipeTags = sqliteTable('recipe_tags', {
  recipeId: text('recipe_id').references(() => recipes.id, { onUpdate: 'cascade', onDelete: "cascade" }),
  tagId: text('tag_id').references(() => tags.id, { onUpdate: 'cascade', onDelete: "cascade" }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.recipeId, table.tagId] }),
}));

export const recipeTagsRelations = relations(recipeTags, ({ one }) => ({
  recipes: one(recipes, { fields: [recipeTags.recipeId], references: [recipes.id] }),
  tags: one(tags, { fields: [recipeTags.tagId], references: [tags.id] }),
}));

export const insertRecipeTagSchema = createInsertSchema(recipeTags).omit({ createdDate: true, updatedDate: true });
export type InsertRecipeTag = z.infer<typeof insertRecipeTagSchema>;

export const selectRecipeTagSchema = createSelectSchema(recipeTags);
export type RecipeTag = z.infer<typeof selectRecipeTagSchema>;

export const menuTags = sqliteTable('menu_tags', {
  menuId: text('menu_id').references(() => menus.id, { onUpdate: 'cascade', onDelete: "cascade" }),
  tagId: text('tag_id').references(() => tags.id, { onUpdate: 'cascade', onDelete: "cascade" }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.menuId, table.tagId] }),
}));

export const menuTagsRelations = relations(menuTags, ({ one }) => ({
  menus: one(menus, { fields: [menuTags.menuId], references: [menus.id] }),
  tags: one(tags, { fields: [menuTags.tagId], references: [tags.id] }),
}));

export const insertMenuTagSchema = createInsertSchema(menuTags).omit({ createdDate: true, updatedDate: true });
export type InsertMenuTag = z.infer<typeof insertMenuTagSchema>;

export const selectMenuTagSchema = createSelectSchema(menuTags);
export type MenuTag = z.infer<typeof selectMenuTagSchema>;


export const menuCourseTags = sqliteTable('menu_course_tags', {
  menuCourseId: text('menu_course_id').references(() => menuCourses.id, { onUpdate: 'cascade', onDelete: "cascade" }),
  tagId: text('tag_id').references(() => tags.id, { onUpdate: 'cascade', onDelete: "cascade" }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.menuCourseId, table.tagId] }),
}));

export const menuCourseTagsRelations = relations(menuCourseTags, ({ one }) => ({
  menuCourses: one(menuCourses, { fields: [menuCourseTags.menuCourseId], references: [menuCourses.id] }),
  tags: one(tags, { fields: [menuCourseTags.tagId], references: [tags.id] }),
}));

export const insertMenuCourseTagSchema = createInsertSchema(menuCourseTags).omit({ createdDate: true, updatedDate: true });
export type InsertMenuCourseTag = z.infer<typeof insertMenuCourseTagSchema>;

export const selectMenuCourseTagSchema = createSelectSchema(menuCourseTags);
export type MenuCourseTag = z.infer<typeof selectMenuCourseTagSchema>;

// Inspiration
// https://schema.org/Recipe
export const recipes = sqliteTable('recipes', {
  id: text('id').$default(() => createId()).primaryKey(),
  cookTime: text('cook_time'),
  description: text('description'),
  isPrivate: integer('is_private', { mode: 'boolean' }).$default(() => false),
  preparationSteps: text('preparation_steps'),
  prepTime: text('prep_time'),
  recipeYield: text('recipe_yield'),
  author: text('author'),
  source: text('source'),
  sourceUrl: text('source_url'),
  submittedBy: text('submitted_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title'),
  totalTime: text('total_time'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  // comments: many(comments),
  cookLog: many(cookLog),
  menuRecipes: many(menuRecipes),
  recipeComments: many(recipeComments),
  recipeIngredients: many(recipeIngredients),
  recipeRatings: many(recipeRatings),
  recipeTags: many(recipeTags),
  user: one(users, { fields: [recipes.submittedBy], references: [users.id] }),
  userCookLogs: many(userCookLogs),
  userRecipeCollections: many(userRecipeCollections),
}));

export const insertRecipesSchema = createInsertSchema(recipes).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertRecipe = z.infer<typeof insertRecipesSchema>;

export const selectRecipesSchema = createSelectSchema(recipes);
export type Recipe = z.infer<typeof selectRecipesSchema>;

export const collections = sqliteTable('collections', {
  id: text('id').$default(() => createId()).primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name'),
  isPrivate: integer('is_private', { mode: 'boolean' }).$default(() => false),
  isDefault: integer('is_default', { mode: 'boolean' }).$default(() => false),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  collectionAccess: many(collectionAccess),
  user: one(users, { fields: [collections.userId], references: [users.id] }),
  userRecipeCollections: many(userRecipeCollections),
}));

export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export const selectCollectionSchema = createSelectSchema(collections);
export type Collection = z.infer<typeof selectCollectionSchema>;

export const collectionAccess = sqliteTable('collection_access', {
  collectionId: text('collection_id').references(() => collections.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  accessLevel: text('access_level').$default(() => 'read'), // Access levels: read, write, admin
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.collectionId, table.userId] }),
}));

export const collectionAccessRelations = relations(collectionAccess, ({ one }) => ({
  collection: one(collections, { fields: [collectionAccess.collectionId], references: [collections.id] }),
  user: one(users, { fields: [collectionAccess.userId], references: [users.id] }),
}));

export const insertCollectionAccessSchema = createInsertSchema(collectionAccess).omit({ createdDate: true, updatedDate: true });
export type InsertCollectionAccess = z.infer<typeof insertCollectionAccessSchema>;

export const selectCollectionAccessSchema = createSelectSchema(collectionAccess);
export type CollectionAccess = z.infer<typeof selectCollectionAccessSchema>;

export const userRecipeCollections = sqliteTable('user_recipe_collections', {
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  collectionId: text('collection_id').references(() => collections.id, { onDelete: 'cascade' }).notNull(),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.recipeId, table.collectionId] }),
}));

export const userRecipeCollectionsRelations = relations(userRecipeCollections, ({ one }) => ({
  collections: one(collections, { fields: [userRecipeCollections.collectionId], references: [collections.id] }),
  recipes: one(recipes, { fields: [userRecipeCollections.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [userRecipeCollections.userId], references: [users.id] }),
}));

export const insertUserRecipeCollectionSchema = createInsertSchema(userRecipeCollections).omit({ createdDate: true });
export type InsertUserRecipeCollection = z.infer<typeof insertUserRecipeCollectionSchema>;

export const selectUserRecipeCollectionSchema = createSelectSchema(userRecipeCollections);
export type UserRecipeCollection = z.infer<typeof selectUserRecipeCollectionSchema>;

export const cookLog = sqliteTable('cook_log', {
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  cookDate: text('cook_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.recipeId, table.userId] }),
}));

export const cookLogRelations = relations(cookLog, ({ one }) => ({
  recipe: one(recipes, { fields: [cookLog.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [cookLog.userId], references: [users.id] }),
}));

export const insertCookLogSchema = createInsertSchema(cookLog).omit({ cookDate: true });
export type InsertCookLog = z.infer<typeof insertCookLogSchema>;

export const selectCookLogSchema = createSelectSchema(cookLog);
export type CookLog = z.infer<typeof selectCookLogSchema>;

// TODO: Replace userCookLogs with simpler cookLog
export const userCookLogs = sqliteTable('user_cook_logs', {
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  recipeId: text('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  cookCount: integer('cook_count').$default(() => 0),
  lastCooked: text('last_cooked'),
  firstCooked: text('first_cooked').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.recipeId] }),
}));

export const userCookLogsRelations = relations(userCookLogs, ({ one }) => ({
  recipes: one(recipes, { fields: [userCookLogs.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [userCookLogs.userId], references: [users.id] }),
}));

export const insertUserCookLogSchema = createInsertSchema(userCookLogs).omit({ cookCount: true, firstCooked: true });
export type InsertUserCookLog = z.infer<typeof insertUserCookLogSchema>;

export const selectUserCookLogSchema = createSelectSchema(userCookLogs);
export type UserCookLog = z.infer<typeof selectUserCookLogSchema>;

export const userInvites = sqliteTable('user_invites', {
  id: text('id').$default(() => createId()).primaryKey(),
  email: text('email').unique(),
  phoneNumber: text('phone_number').unique(),
  status: text('status', { enum: ["pending", "accepted", "expired", "deactivated", "deleted", "rejected"] }).$default(() => "pending"),
  userId: text('user_id').references(() => users.id),
  invitedBy: text('invited_by').references(() => users.id).notNull(),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  acceptedDate: text('accepted_date').$default(() => toISO8601(new Date())),
});

export const userInvitesRelations = relations(userInvites, ({ one }) => ({
  user: one(users, { relationName: 'invitee', fields: [userInvites.userId], references: [users.id] }),
  invitedBy: one(users, { relationName: 'inviter', fields: [userInvites.invitedBy], references: [users.id] }),
}));

export const insertUserInviteSchema = createInsertSchema(userInvites).omit({ id: true, createdDate: true, acceptedDate: true });
export type InsertUserInvite = z.infer<typeof insertUserInviteSchema>;

export const selectUserInviteSchema = createSelectSchema(userInvites);
export type UserInvite = z.infer<typeof selectUserInviteSchema>;

export const passwords = sqliteTable('passwords', {
  encryptedPassword: text('encrypted_password'),
  userId: text('user_id').unique().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users),
}));

// Schema for inserting a password - can be used to validate API requests
export const insertPasswordSchema = createInsertSchema(passwords).omit({ createdDate: true, updatedDate: true });
export type InsertPassword = z.infer<typeof insertPasswordSchema>;

// Schema for selecting a user - can be used to validate API responses
export const selectPasswordSchema = createSelectSchema(passwords);
export type Password = z.infer<typeof selectPasswordSchema>;

const safeRoles = ['user', 'guest'] as const;
const unsafeRoles = ['admin'] as const;
const allRoles = [...safeRoles, ...unsafeRoles] as const;

// Use const lists to create zod enums (for parsing / validation)
const SafeRolesSchema = z.enum(safeRoles);
const UnsafeRolesSchema = z.enum(unsafeRoles);
export const AllRolesSchema = z.union([SafeRolesSchema, UnsafeRolesSchema]);

// Infer Schemas to types
export type SafeRoles = z.infer<typeof SafeRolesSchema>;
export type AllRoles = z.infer<typeof AllRolesSchema>;

export const roles = sqliteTable('roles', {
  id: text('id').$default(() => createId()).primaryKey(),
  name: text('name', { enum: allRoles }).$default(() => 'user'),
  description: text('description'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertRole = z.infer<typeof insertRoleSchema>;

export const selectRoleSchema = createSelectSchema(roles);
export type Role = z.infer<typeof selectRoleSchema>;

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissions = sqliteTable('permissions', {
  id: text('id').$default(() => createId()).primaryKey(),
  name: text('name'),
  description: text('description'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true, createdDate: true, updatedDate: true });
export type InsertPermission = z.infer<typeof insertPermissionSchema>;

export const selectPermissionSchema = createSelectSchema(permissions);
export type Permission = z.infer<typeof selectPermissionSchema>;

export const userRoles = sqliteTable('user_roles', {
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  roleId: text('role_id').references(() => roles.id, { onDelete: 'cascade' }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  }
});

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  roles: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
  users: one(users, { fields: [userRoles.userId], references: [users.id] }),
}));

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ createdDate: true });
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;

export const selectUserRoleSchema = createSelectSchema(userRoles);
export type UserRole = z.infer<typeof selectUserRoleSchema>;

export const rolePermissions = sqliteTable('role_permissions', {
  roleId: text('role_id').references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: text('permission_id').references(() => permissions.id, { onDelete: 'cascade' }),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  roles: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permissions: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({ createdDate: true });
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;

export const selectRolePermissionSchema = createSelectSchema(rolePermissions);
export type RolePermission = z.infer<typeof selectRolePermissionSchema>;

export const auditLogs = sqliteTable('audit_logs', {
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  action: text('action'),
  timeStamp: text('time_stamp').$default(() => toISO8601(new Date())),
}, (table) => ({
  unq: unique().on(table.userId, table.action, table.timeStamp),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));


export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ timeStamp: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export const selectAuditLogSchema = createSelectSchema(auditLogs);
export type AuditLog = z.infer<typeof selectAuditLogSchema>;


export const userSettings = sqliteTable('user_settings', {
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  setting: text('setting'),
  value: text('value'),
  createdDate: text('created_date').$default(() => toISO8601(new Date())),
  updatedDate: text('updated_date').$default(() => toISO8601(new Date())),
});

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, { fields: [userSettings.userId], references: [users.id] }),
}));

export const insertUserSettingSchema = createInsertSchema(userSettings).omit({ createdDate: true, updatedDate: true });
export type InsertUserSetting = z.infer<typeof insertUserSettingSchema>;

export const selectUserSettingSchema = createSelectSchema(userSettings);
export type UserSetting = z.infer<typeof selectUserSettingSchema>;