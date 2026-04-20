import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Authors (Beat Writer Personas) ──────────────────────────────────────────

export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  bio: text("bio"),
  shortBio: text("shortBio"), // 1-2 sentence version for bylines
  avatarUrl: text("avatarUrl"),
  vertical: mysqlEnum("vertical", [
    "gaming",
    "tv-streaming",
    "music-movies",
    "comics-cosplay-anime",
    "technology-culture",
    "editorial",
  ]).notNull(),
  twitterHandle: varchar("twitterHandle", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  articleCount: int("articleCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = typeof authors.$inferInsert;

// ─── Pipeline API Tokens ──────────────────────────────────────────────────────

export const pipelineTokens = mysqlTable("pipeline_tokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(), // e.g. "Python Pipeline v1"
  isActive: boolean("isActive").default(true).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PipelineToken = typeof pipelineTokens.$inferSelect;
export type InsertPipelineToken = typeof pipelineTokens.$inferInsert;

// ─── Articles (News + Blog) ───────────────────────────────────────────────────

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  subhead: text("subhead"),
  body: text("body").notNull(),
  imageUrl: text("imageUrl"),
  // Primary category (legacy / broad)
  category: mysqlEnum("category", [
    "gaming",
    "film",
    "tv",
    "comics",
    "tech",
    "culture",
    "events",
    "creators",
  ]).notNull(),
  // Vertical subcategory (5 official BLRD verticals)
  vertical: mysqlEnum("vertical", [
    "gaming",
    "tv-streaming",
    "music-movies",
    "comics-cosplay-anime",
    "technology-culture",
  ]),
  type: mysqlEnum("type", ["news", "blog", "feature"]).default("news").notNull(),
  tags: text("tags"), // JSON array string
  // Author can be a beat writer persona (authorSlug) or a user (authorId)
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }),
  authorSlug: varchar("authorSlug", { length: 100 }), // references authors.slug
  // Perplexity-style citations stored as JSON: [{label, url, note}]
  citations: text("citations"),
  status: mysqlEnum("status", ["draft", "published", "pending"]).default("published").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  // Source of article: manual admin entry vs automated pipeline
  source: mysqlEnum("source", ["manual", "pipeline"]).default("manual").notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  subhead: text("subhead"),
  body: text("body").notNull(),
  imageUrl: text("imageUrl"),
  category: mysqlEnum("category", ["games", "tv", "movies", "comics", "music"]).notNull(),
  // Vertical subcategory alignment
  vertical: mysqlEnum("vertical", [
    "gaming",
    "tv-streaming",
    "music-movies",
    "comics-cosplay-anime",
    "technology-culture",
  ]),
  releaseYear: int("releaseYear"),
  developer: varchar("developer", { length: 255 }),
  publisher: varchar("publisher", { length: 255 }),
  genre: varchar("genre", { length: 255 }),
  // External ratings stored as JSON: [{source, score, maxScore, url}]
  externalRatings: text("externalRatings"),
  avgUserRating: decimal("avgUserRating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: int("totalRatings").default(0).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  authorSlug: varchar("authorSlug", { length: 100 }),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ─── User Ratings ─────────────────────────────────────────────────────────────

export const userRatings = mysqlTable("user_ratings", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId").notNull(),
  userId: int("userId").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(), // 0.0 – 5.0
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserRating = typeof userRatings.$inferSelect;
export type InsertUserRating = typeof userRatings.$inferInsert;

// ─── Discover Items ───────────────────────────────────────────────────────────

export const discoverItems = mysqlTable("discover_items", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  subhead: text("subhead"),
  imageUrl: text("imageUrl"),
  ctaLabel: varchar("ctaLabel", { length: 100 }).default("Learn More"),
  ctaUrl: text("ctaUrl"),
  contentType: mysqlEnum("contentType", ["article", "video", "podcast"]).default("article").notNull(),
  sponsor: varchar("sponsor", { length: 255 }),
  vertical: mysqlEnum("vertical", [
    "gaming",
    "tv-streaming",
    "music-movies",
    "comics-cosplay-anime",
    "technology-culture",
  ]),
  tags: text("tags"), // JSON array string
  isFeatured: boolean("isFeatured").default(false).notNull(), // marquee
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiscoverItem = typeof discoverItems.$inferSelect;
export type InsertDiscoverItem = typeof discoverItems.$inferInsert;

// ─── Events ───────────────────────────────────────────────────────────────────

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  eventType: mysqlEnum("eventType", [
    "convention",
    "tournament",
    "panel",
    "screening",
    "workshop",
    "watch-party",
    "virtual",
    "other",
  ]).notNull(),
  category: mysqlEnum("category", [
    "gaming",
    "comics",
    "film",
    "tv",
    "tech",
    "culture",
    "multi",
  ]).notNull(),
  location: varchar("location", { length: 255 }),
  isVirtual: boolean("isVirtual").default(false).notNull(),
  registrationUrl: text("registrationUrl"),
  trackedUrl: text("trackedUrl"),
  clickCount: int("clickCount").default(0).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─── Contact Submissions ──────────────────────────────────────────────────────

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  inquiryType: mysqlEnum("inquiryType", [
    "partnership",
    "advertising",
    "press",
    "community",
    "general",
  ]).default("general").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
