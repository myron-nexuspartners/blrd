CREATE TABLE `authors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`title` varchar(255),
	`bio` text,
	`shortBio` text,
	`avatarUrl` text,
	`vertical` enum('gaming','tv-streaming','music-movies','comics-cosplay-anime','technology-culture','editorial') NOT NULL,
	`twitterHandle` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`articleCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `authors_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `pipeline_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`label` varchar(255) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pipeline_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `pipeline_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `articles` ADD `vertical` enum('gaming','tv-streaming','music-movies','comics-cosplay-anime','technology-culture');--> statement-breakpoint
ALTER TABLE `articles` ADD `authorSlug` varchar(100);--> statement-breakpoint
ALTER TABLE `articles` ADD `citations` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `source` enum('manual','pipeline') DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE `discover_items` ADD `vertical` enum('gaming','tv-streaming','music-movies','comics-cosplay-anime','technology-culture');--> statement-breakpoint
ALTER TABLE `reviews` ADD `vertical` enum('gaming','tv-streaming','music-movies','comics-cosplay-anime','technology-culture');--> statement-breakpoint
ALTER TABLE `reviews` ADD `authorSlug` varchar(100);