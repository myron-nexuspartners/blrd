import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { contactSubmissions, userRatings, events, articles } from "../drizzle/schema";
import { eq, and, sql, desc, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { notifyOwner } from "./_core/notification";
import { adminRouter } from "./routers/admin";
import { authorsRouter } from "./routers/authors";
import { pipelineRouter } from "./routers/pipeline";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // --- Admin --------------------------------------------------------------
  admin: adminRouter,

  // --- Authors ------------------------------------------------------------
  authors: authorsRouter,

  // --- Pipeline -----------------------------------------------------------
  pipeline: pipelineRouter,

  // --- Reviews ------------------------------------------------------------
  reviews: router({
    rate: protectedProcedure
      .input(z.object({ contentId: z.number(), rating: z.number().min(1).max(5) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db
          .insert(userRatings)
          .values({
            reviewId: input.contentId,
            userId: ctx.user.id,
            rating: String(input.rating),
          })
          .onDuplicateKeyUpdate({ set: { rating: String(input.rating) } });

        return { success: true };
      }),

    getUserRating: protectedProcedure
      .input(z.object({ contentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(userRatings)
          .where(
            and(
              eq(userRatings.reviewId, input.contentId),
              eq(userRatings.userId, ctx.user.id)
            )
          )
          .limit(1);

        return result[0] ?? null;
      }),
  }),

  // --- Events -------------------------------------------------------------
  events: router({
    trackClick: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };

        await db
          .update(events)
          .set({ clickCount: sql`${events.clickCount} + 1` })
          .where(eq(events.id, input.eventId));

        return { success: true };
      }),
  }),

  // --- Articles (public queries) -----------------------------------------
  articles: router({
    // Returns the single most-recent published article for each of the 5 verticals
    latestByVertical: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];

      const verticals = [
        "gaming",
        "tv-streaming",
        "music-movies",
        "comics-cosplay-anime",
        "technology-culture",
      ] as const;

      // Fetch the 3 most-recent published articles per vertical in one query,
      // then pick the newest per vertical in JS (avoids complex subquery).
      const rows = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.status, "published"),
            inArray(articles.vertical, [...verticals])
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(25);

      // Deduplicate: keep only the first (newest) article per vertical
      const seen = new Set<string>();
      const result: typeof rows = [];
      for (const row of rows) {
        if (row.vertical && !seen.has(row.vertical)) {
          seen.add(row.vertical);
          result.push(row);
        }
        if (result.length === verticals.length) break;
      }

      // Ensure all 5 verticals are represented (fill missing with null placeholders)
      return verticals.map((v) => result.find((r) => r.vertical === v) ?? null);
    }),

    // --- articles.list -- powers News.tsx and Blog.tsx --------------------
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          type:     z.string().optional(),
          limit:    z.number().min(1).max(100).optional().default(50),
          offset:   z.number().min(0).optional().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [eq(articles.status, "published")];

        if (input.category && input.category !== "all") {
          conditions.push(eq(articles.category, input.category as any));
        }
        if (input.type && input.type !== "all") {
          conditions.push(eq(articles.type, input.type as any));
        }

        return await db
          .select()
          .from(articles)
          .where(and(...conditions))
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit)
          .offset(input.offset);
      }),
  }),

  // --- Blog / Articles ----------------------------------------------------
  blog: router({
    submit: protectedProcedure
      .input(
        z.object({
          title: z.string().min(5).max(255),
          subhead: z.string().max(500).optional(),
          body: z.string().min(50),
          category: z.enum(["gaming", "film", "tv", "comics", "tech", "culture", "events", "creators"]),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const slug = input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 200) + "-" + Date.now();

        await db.insert(articles).values({
          slug,
          title: input.title,
          subhead: input.subhead ?? null,
          body: input.body,
          category: input.category,
          type: "blog",
          tags: input.tags ? JSON.stringify(input.tags) : null,
          authorId: ctx.user.id,
          authorName: ctx.user.name ?? "Community Member",
          status: "pending",
          isFeatured: false,
          viewCount: 0,
          publishedAt: new Date(),
        });

        await notifyOwner({
          title: "New Blog Submission",
          content: `${ctx.user.name || "A user"} submitted a blog post: "${input.title}"`,
        });

        return { success: true };
      }),
  }),

  // --- Contact ------------------------------------------------------------
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          email: z.string().email(),
          subject: z.string().max(255).optional(),
          message: z.string().min(10),
          inquiryType: z.enum(["partnership", "advertising", "press", "community", "general"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        await db.insert(contactSubmissions).values({
          name: input.name,
          email: input.email,
          subject: input.subject ?? null,
          message: input.message,
          inquiryType: input.inquiryType,
          status: "new",
        });

        await notifyOwner({
          title: `New ${input.inquiryType} inquiry from ${input.name}`,
          content: `Email: ${input.email}\n\n${input.message.slice(0, 300)}`,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
