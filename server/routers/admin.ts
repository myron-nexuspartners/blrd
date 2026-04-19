import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import {
  articles,
  contactSubmissions,
  events,
  reviews,
  userRatings,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

// ─── Admin Guard Middleware ───────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

// ─── Admin Router ─────────────────────────────────────────────────────────────
export const adminRouter = router({
  // ─── Dashboard Stats ──────────────────────────────────────────────────────
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

    const [pendingBlogCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(and(eq(articles.type, "blog"), eq(articles.status, "pending")));

    const [totalBlogCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.type, "blog"));

    const [totalReviewCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews);

    const [totalEventCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(eq(events.isActive, true));

    const [newContactCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.status, "new"));

    const [totalRatingsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userRatings);

    return {
      pendingBlogPosts: Number(pendingBlogCount?.count ?? 0),
      totalBlogPosts: Number(totalBlogCount?.count ?? 0),
      totalReviews: Number(totalReviewCount?.count ?? 0),
      totalEvents: Number(totalEventCount?.count ?? 0),
      newContacts: Number(newContactCount?.count ?? 0),
      totalRatings: Number(totalRatingsCount?.count ?? 0),
    };
  }),

  // ─── Blog Management ──────────────────────────────────────────────────────
  blog: router({
    list: adminProcedure
      .input(
        z.object({
          status: z.enum(["all", "pending", "published", "draft"]).default("all"),
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(20),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const offset = (input.page - 1) * input.pageSize;

        const conditions = [eq(articles.type, "blog")];
        if (input.status !== "all") {
          conditions.push(eq(articles.status, input.status as "pending" | "published" | "draft"));
        }

        const rows = await db
          .select()
          .from(articles)
          .where(and(...conditions))
          .orderBy(desc(articles.createdAt))
          .limit(input.pageSize)
          .offset(offset);

        const [countRow] = await db
          .select({ count: sql<number>`count(*)` })
          .from(articles)
          .where(and(...conditions));

        return {
          items: rows,
          total: Number(countRow?.count ?? 0),
          page: input.page,
          pageSize: input.pageSize,
        };
      }),

    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db
          .update(articles)
          .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
          .where(eq(articles.id, input.id));

        return { success: true };
      }),

    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db
          .update(articles)
          .set({ status: "draft", updatedAt: new Date() })
          .where(eq(articles.id, input.id));

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db.delete(articles).where(eq(articles.id, input.id));
        return { success: true };
      }),

    feature: adminProcedure
      .input(z.object({ id: z.number(), featured: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db
          .update(articles)
          .set({ isFeatured: input.featured, updatedAt: new Date() })
          .where(eq(articles.id, input.id));

        return { success: true };
      }),
  }),

  // ─── Review Management ────────────────────────────────────────────────────
  reviews: router({
    list: adminProcedure
      .input(
        z.object({
          category: z.enum(["all", "games", "tv", "movies", "comics", "music"]).default("all"),
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(20),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const offset = (input.page - 1) * input.pageSize;

        const rows =
          input.category === "all"
            ? await db
                .select()
                .from(reviews)
                .orderBy(desc(reviews.createdAt))
                .limit(input.pageSize)
                .offset(offset)
            : await db
                .select()
                .from(reviews)
                .where(eq(reviews.category, input.category as "games" | "tv" | "movies" | "comics" | "music"))
                .orderBy(desc(reviews.createdAt))
                .limit(input.pageSize)
                .offset(offset);

        const [countRow] =
          input.category === "all"
            ? await db.select({ count: sql<number>`count(*)` }).from(reviews)
            : await db
                .select({ count: sql<number>`count(*)` })
                .from(reviews)
                .where(eq(reviews.category, input.category as "games" | "tv" | "movies" | "comics" | "music"));

        return {
          items: rows,
          total: Number(countRow?.count ?? 0),
          page: input.page,
          pageSize: input.pageSize,
        };
      }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(2).max(255),
          subhead: z.string().max(500).optional(),
          body: z.string().min(10),
          imageUrl: z.string().optional(),
          category: z.enum(["games", "tv", "movies", "comics", "music"]),
          releaseYear: z.number().optional(),
          developer: z.string().max(255).optional(),
          publisher: z.string().max(255).optional(),
          genre: z.string().max(255).optional(),
          externalRatings: z.string().optional(), // JSON string
          isFeatured: z.boolean().default(false),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const slug =
          input.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 200) +
          "-" +
          Date.now();

        const [result] = await db.insert(reviews).values({
          slug,
          title: input.title,
          subhead: input.subhead ?? null,
          body: input.body,
          imageUrl: input.imageUrl ?? null,
          category: input.category,
          releaseYear: input.releaseYear ?? null,
          developer: input.developer ?? null,
          publisher: input.publisher ?? null,
          genre: input.genre ?? null,
          externalRatings: input.externalRatings ?? null,
          isFeatured: input.isFeatured,
          avgUserRating: "0",
          totalRatings: 0,
        });

        return { success: true, id: (result as any).insertId };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(2).max(255).optional(),
          subhead: z.string().max(500).optional(),
          body: z.string().min(10).optional(),
          imageUrl: z.string().optional(),
          category: z.enum(["games", "tv", "movies", "comics", "music"]).optional(),
          releaseYear: z.number().optional(),
          developer: z.string().max(255).optional(),
          publisher: z.string().max(255).optional(),
          genre: z.string().max(255).optional(),
          externalRatings: z.string().optional(),
          isFeatured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const { id, ...fields } = input;
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        for (const [k, v] of Object.entries(fields)) {
          if (v !== undefined) updateData[k] = v;
        }

        await db.update(reviews).set(updateData).where(eq(reviews.id, id));
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        // Delete associated ratings first
        await db.delete(userRatings).where(eq(userRatings.reviewId, input.id));
        await db.delete(reviews).where(eq(reviews.id, input.id));
        return { success: true };
      }),

    feature: adminProcedure
      .input(z.object({ id: z.number(), featured: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db
          .update(reviews)
          .set({ isFeatured: input.featured, updatedAt: new Date() })
          .where(eq(reviews.id, input.id));

        return { success: true };
      }),
  }),

  // ─── Event Management ─────────────────────────────────────────────────────
  events: router({
    list: adminProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(20),
          includeInactive: z.boolean().default(true),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const offset = (input.page - 1) * input.pageSize;

        const rows = input.includeInactive
          ? await db
              .select()
              .from(events)
              .orderBy(asc(events.startDate))
              .limit(input.pageSize)
              .offset(offset)
          : await db
              .select()
              .from(events)
              .where(eq(events.isActive, true))
              .orderBy(asc(events.startDate))
              .limit(input.pageSize)
              .offset(offset);

        const [countRow] = input.includeInactive
          ? await db.select({ count: sql<number>`count(*)` }).from(events)
          : await db
              .select({ count: sql<number>`count(*)` })
              .from(events)
              .where(eq(events.isActive, true));

        return {
          items: rows,
          total: Number(countRow?.count ?? 0),
          page: input.page,
          pageSize: input.pageSize,
        };
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          eventType: z.enum(["convention", "tournament", "panel", "screening", "workshop", "watch-party", "virtual", "other"]),
          category: z.enum(["gaming", "comics", "film", "tv", "tech", "culture", "multi"]),
          location: z.string().max(255).optional(),
          isVirtual: z.boolean().default(false),
          registrationUrl: z.string().optional(),
          startDate: z.string(), // ISO string from frontend
          endDate: z.string().optional(),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const [result] = await db.insert(events).values({
          name: input.name,
          description: input.description ?? null,
          imageUrl: input.imageUrl ?? null,
          eventType: input.eventType,
          category: input.category,
          location: input.location ?? null,
          isVirtual: input.isVirtual,
          registrationUrl: input.registrationUrl ?? null,
          trackedUrl: input.registrationUrl
            ? `${input.registrationUrl}?utm_source=blrd&utm_medium=events&utm_campaign=blrd-events`
            : null,
          clickCount: 0,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          isActive: input.isActive,
        });

        return { success: true, id: (result as any).insertId };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(2).max(255).optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          eventType: z.enum(["convention", "tournament", "panel", "screening", "workshop", "watch-party", "virtual", "other"]).optional(),
          category: z.enum(["gaming", "comics", "film", "tv", "tech", "culture", "multi"]).optional(),
          location: z.string().max(255).optional(),
          isVirtual: z.boolean().optional(),
          registrationUrl: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const { id, startDate, endDate, registrationUrl, ...rest } = input;
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        for (const [k, v] of Object.entries(rest)) {
          if (v !== undefined) updateData[k] = v;
        }
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (registrationUrl !== undefined) {
          updateData.registrationUrl = registrationUrl;
          updateData.trackedUrl = registrationUrl
            ? `${registrationUrl}?utm_source=blrd&utm_medium=events&utm_campaign=blrd-events`
            : null;
        }

        await db.update(events).set(updateData).where(eq(events.id, id));
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db.delete(events).where(eq(events.id, input.id));
        return { success: true };
      }),

    toggleActive: adminProcedure
      .input(z.object({ id: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db
          .update(events)
          .set({ isActive: input.isActive, updatedAt: new Date() })
          .where(eq(events.id, input.id));

        return { success: true };
      }),
  }),

  // ─── Contact Submissions ──────────────────────────────────────────────────
  contacts: router({
    list: adminProcedure
      .input(
        z.object({
          status: z.enum(["all", "new", "read", "replied"]).default("all"),
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(50).default(20),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        const offset = (input.page - 1) * input.pageSize;

        const rows =
          input.status === "all"
            ? await db
                .select()
                .from(contactSubmissions)
                .orderBy(desc(contactSubmissions.createdAt))
                .limit(input.pageSize)
                .offset(offset)
            : await db
                .select()
                .from(contactSubmissions)
                .where(eq(contactSubmissions.status, input.status as "new" | "read" | "replied"))
                .orderBy(desc(contactSubmissions.createdAt))
                .limit(input.pageSize)
                .offset(offset);

        const [countRow] =
          input.status === "all"
            ? await db.select({ count: sql<number>`count(*)` }).from(contactSubmissions)
            : await db
                .select({ count: sql<number>`count(*)` })
                .from(contactSubmissions)
                .where(eq(contactSubmissions.status, input.status as "new" | "read" | "replied"));

        return {
          items: rows,
          total: Number(countRow?.count ?? 0),
          page: input.page,
          pageSize: input.pageSize,
        };
      }),

    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["new", "read", "replied"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db
          .update(contactSubmissions)
          .set({ status: input.status })
          .where(eq(contactSubmissions.id, input.id));

        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

        await db.delete(contactSubmissions).where(eq(contactSubmissions.id, input.id));
        return { success: true };
      }),
  }),
});
