CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`featured_image` text,
	`category` text,
	`tags` text,
	`author` text DEFAULT 'HUGUO' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`publish_date` text NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`created_at` text DEFAULT '2026-03-01T00:46:01.446Z',
	`updated_at` text DEFAULT '2026-03-01T00:46:01.448Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
DROP TABLE `users`;