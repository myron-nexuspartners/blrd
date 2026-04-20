import { eq, desc } from "drizzle-orm";
import { z } from "zod/v4";
import { authors, articles } from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

export const authorsRouter = router({
  // ─── Public: list all active authors ─────────────────────────────────────
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(authors)
      .where(eq(authors.isActive, true))
      .orderBy(authors.name);
  }),

  // ─── Public: get single author by slug ───────────────────────────────────
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(authors)
        .where(eq(authors.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  // ─── Public: get articles by author slug ─────────────────────────────────
  articles: publicProcedure
    .input(z.object({ slug: z.string(), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(articles)
        .where(eq(articles.authorSlug, input.slug))
        .orderBy(desc(articles.publishedAt))
        .limit(input.limit);
    }),

  // ─── Admin: create author ─────────────────────────────────────────────────
  create: adminProcedure
    .input(
      z.object({
        slug: z.string().min(2).max(100),
        name: z.string().min(2).max(255),
        title: z.string().max(255).optional(),
        bio: z.string().optional(),
        shortBio: z.string().max(500).optional(),
        avatarUrl: z.string().optional(),
        vertical: z.enum([
          "gaming",
          "tv-streaming",
          "music-movies",
          "comics-cosplay-anime",
          "technology-culture",
          "editorial",
        ]),
        twitterHandle: z.string().max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.insert(authors).values({
        ...input,
        isActive: true,
        articleCount: 0,
      });
      return { success: true };
    }),

  // ─── Admin: update author ─────────────────────────────────────────────────
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).max(255).optional(),
        title: z.string().max(255).optional(),
        bio: z.string().optional(),
        shortBio: z.string().max(500).optional(),
        avatarUrl: z.string().optional(),
        vertical: z
          .enum([
            "gaming",
            "tv-streaming",
            "music-movies",
            "comics-cosplay-anime",
            "technology-culture",
            "editorial",
          ])
          .optional(),
        twitterHandle: z.string().max(100).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { id, ...rest } = input;
      await db.update(authors).set(rest).where(eq(authors.id, id));
      return { success: true };
    }),

  // ─── Admin: delete author ─────────────────────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(authors).where(eq(authors.id, input.id));
      return { success: true };
    }),
});
