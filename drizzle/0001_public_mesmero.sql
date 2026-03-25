CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`subhead` text,
	`body` text NOT NULL,
	`imageUrl` text,
	`category` enum('gaming','film','tv','comics','tech','culture','events','creators') NOT NULL,
	`type` enum('news','blog','feature') NOT NULL DEFAULT 'news',
	`tags` text,
	`authorId` int,
	`authorName` varchar(255),
	`status` enum('draft','published','pending') NOT NULL DEFAULT 'published',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`inquiryType` enum('partnership','advertising','press','community','general') NOT NULL DEFAULT 'general',
	`status` enum('new','read','replied') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discover_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`subhead` text,
	`imageUrl` text,
	`ctaLabel` varchar(100) DEFAULT 'Learn More',
	`ctaUrl` text,
	`contentType` enum('article','video','podcast') NOT NULL DEFAULT 'article',
	`sponsor` varchar(255),
	`tags` text,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discover_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`eventType` enum('convention','tournament','panel','screening','workshop','watch-party','virtual','other') NOT NULL,
	`category` enum('gaming','comics','film','tv','tech','culture','multi') NOT NULL,
	`location` varchar(255),
	`isVirtual` boolean NOT NULL DEFAULT false,
	`registrationUrl` text,
	`trackedUrl` text,
	`clickCount` int NOT NULL DEFAULT 0,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`subhead` text,
	`body` text NOT NULL,
	`imageUrl` text,
	`category` enum('games','tv','movies','comics','music') NOT NULL,
	`releaseYear` int,
	`developer` varchar(255),
	`publisher` varchar(255),
	`genre` varchar(255),
	`externalRatings` text,
	`avgUserRating` decimal(3,2) DEFAULT '0',
	`totalRatings` int NOT NULL DEFAULT 0,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reviewId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` decimal(3,1) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_ratings_id` PRIMARY KEY(`id`)
);
