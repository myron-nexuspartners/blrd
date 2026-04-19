import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { contactSubmissions, userRatings, events, articles } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { notifyOwner } from "./_core/notification";
import { adminRouter } from "./routers/admin";

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

  // ─── Admin ───────────────────────────────────────────────────────────────
  admin: adminRouter,

  // ─── Reviews ────────────────────────────────────────────────────────────
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

  // ─── Events ─────────────────────────────────────────────────────────────
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

  // ─── Blog / Articles ─────────────────────────────────────────────────────
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

        const slug =
          input.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 200) +
          "-" +
          Date.now();

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

  // ─── Contact ─────────────────────────────────────────────────────────────
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
