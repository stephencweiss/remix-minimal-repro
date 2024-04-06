CREATE TABLE `audit_logs` (
	`user_id` text,
	`action` text,
	`time_stamp` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collection_access` (
	`collection_id` text,
	`user_id` text,
	`access_level` text,
	`created_date` text,
	`updated_date` text,
	PRIMARY KEY(`collection_id`, `user_id`),
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text,
	`is_private` integer,
	`is_default` integer,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`submitted_by` text NOT NULL,
	`comment` text NOT NULL,
	`is_private` integer,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cook_log` (
	`recipe_id` text,
	`user_id` text,
	`cook_date` text,
	PRIMARY KEY(`recipe_id`, `user_id`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_comments` (
	`event_id` text NOT NULL,
	`comment_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_guests` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`rsvp` text,
	`role` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`host_id` text NOT NULL,
	`event_date` text,
	`location` text,
	`description` text,
	`menu_id` text,
	`is_private` integer,
	`created_date` text,
	`modified_date` text,
	FOREIGN KEY (`host_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `feedback_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`comment_id` text NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_comments` (
	`menu_id` text NOT NULL,
	`comment_id` text NOT NULL,
	PRIMARY KEY(`comment_id`, `menu_id`),
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_course_comments` (
	`menu_course_id` text NOT NULL,
	`comment_id` text NOT NULL,
	PRIMARY KEY(`comment_id`, `menu_course_id`),
	FOREIGN KEY (`menu_course_id`) REFERENCES `menu_courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_course_recipes` (
	`menu_course_id` text NOT NULL,
	`recipe_id` text NOT NULL,
	PRIMARY KEY(`menu_course_id`, `recipe_id`),
	FOREIGN KEY (`menu_course_id`) REFERENCES `menu_courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `menu_recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_course_tags` (
	`menu_course_id` text,
	`tag_id` text,
	`created_date` text,
	`updated_date` text,
	PRIMARY KEY(`menu_course_id`, `tag_id`),
	FOREIGN KEY (`menu_course_id`) REFERENCES `menu_courses`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_courses` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_id` text NOT NULL,
	`name` text,
	`description` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu_recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_id` text NOT NULL,
	`recipe_id` text NOT NULL,
	`added_by` text,
	`created_date` text,
	`updated_date` text,
	`menu_course_id` text,
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`menu_course_id`) REFERENCES `menu_courses`(`id`) ON UPDATE cascade ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `menu_tags` (
	`menu_id` text,
	`tag_id` text,
	`created_date` text,
	`updated_date` text,
	PRIMARY KEY(`menu_id`, `tag_id`),
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text,
	`feeds_num_people` integer,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`encrypted_password` text,
	`user_id` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`created_date` text,
	`updated_date` text
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` text PRIMARY KEY NOT NULL,
	`rating` integer,
	`submitted_by` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_comments` (
	`recipe_id` text NOT NULL,
	`comment_id` text NOT NULL,
	PRIMARY KEY(`comment_id`, `recipe_id`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_ingredients` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`name` text,
	`quantity` text,
	`unit` text,
	`note` text,
	`raw_ingredient` text,
	`order` integer,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_rating` (
	`recipe_id` text NOT NULL,
	`rating_id` text NOT NULL,
	`user_id` text,
	PRIMARY KEY(`rating_id`, `recipe_id`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rating_id`) REFERENCES `ratings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_tags` (
	`recipe_id` text,
	`tag_id` text,
	`created_date` text,
	`updated_date` text,
	PRIMARY KEY(`recipe_id`, `tag_id`),
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`cook_time` text,
	`description` text,
	`is_private` integer,
	`preparation_steps` text,
	`prep_time` text,
	`recipe_yield` text,
	`author` text,
	`source` text,
	`source_url` text,
	`submitted_by` text NOT NULL,
	`title` text,
	`total_time` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` text,
	`permission_id` text,
	`created_date` text,
	PRIMARY KEY(`permission_id`, `role_id`),
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`created_date` text,
	`updated_date` text
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`is_private` integer,
	`user_id` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `useful_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`comment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_cook_logs` (
	`user_id` text,
	`recipe_id` text,
	`cook_count` integer,
	`last_cooked` text,
	`first_cooked` text,
	PRIMARY KEY(`recipe_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_invites` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`phone_number` text,
	`status` text,
	`user_id` text,
	`invited_by` text NOT NULL,
	`created_date` text,
	`accepted_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invited_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_recipe_collections` (
	`user_id` text NOT NULL,
	`recipe_id` text NOT NULL,
	`collection_id` text NOT NULL,
	`created_date` text,
	PRIMARY KEY(`collection_id`, `recipe_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` text,
	`role_id` text,
	`created_date` text,
	PRIMARY KEY(`role_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`setting` text,
	`value` text,
	`created_date` text,
	`updated_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`phoneNumber` text,
	`name` text,
	`status` text,
	`created_date` text,
	`updated_date` text,
	`last_login_date` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_logs_user_id_action_time_stamp_unique` ON `audit_logs` (`user_id`,`action`,`time_stamp`);--> statement-breakpoint
CREATE UNIQUE INDEX `passwords_user_id_unique` ON `passwords` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_invites_email_unique` ON `user_invites` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_invites_phone_number_unique` ON `user_invites` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);