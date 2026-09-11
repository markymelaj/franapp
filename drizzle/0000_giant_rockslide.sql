CREATE TABLE `recipe_entries` (
	`user_id` text NOT NULL,
	`entry_key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `entry_key`)
);
