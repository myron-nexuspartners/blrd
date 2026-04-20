/**
 * Pipeline Router — accepts article payloads from the Python content pipeline.
 * Authentication uses a Bearer token stored in the pipeline_tokens table.
 * This replaces the WordPress publisher in the Python script.
 *
 * Python usage:
 *   POST /api/pipeline/articles
 *   Authorization: Bearer <token>
 *   Content-Type: application/json
 *   Body: { title, excerpt, content, category, vertical, tags, seo_keywords, author_slug, citations }
 */

import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { articles, pipelineTokens, authors } from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

// ─── Vertical → category mapping ─────────────────────────────────────────────
const verticalToCategoryMap: Record<string, "gaming" | "film" | "tv" | "comics" | "tech" | "culture" | "events" | "creators"> = {
  "gaming": "gaming",
  "tv-streaming": "tv",
  "music-movies": "film",
  "comics-cosplay-anime": "comics",
  "technology-culture": "tech",
};

export const pipelineRouter = router({
  // ─── Admin: generate a new pipeline API token ─────────────────────────────
  generateToken: adminProcedure
    .input(z.object({ label: z.string().min(2).max(255) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Generate a secure random token
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const token = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      await db.insert(pipelineTokens).values({
        token,
        label: input.label,
        isActive: true,
      });

      return { token, label: input.label };
    }),

  // ─── Admin: list all pipeline tokens ─────────────────────────────────────
  listTokens: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(pipelineTokens).orderBy(desc(pipelineTokens.createdAt));
  }),

  // ─── Admin: revoke a token ────────────────────────────────────────────────
  revokeToken: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db
        .update(pipelineTokens)
        .set({ isActive: false })
        .where(eq(pipelineTokens.id, input.id));
      return { success: true };
    }),

  // ─── Admin: list pipeline-sourced articles (draft queue) ─────────────────
  draftQueue: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(articles)
        .where(eq(articles.source, "pipeline"))
        .orderBy(desc(articles.createdAt))
        .limit(input.limit);
    }),

  // ─── Public (token-auth): submit article from pipeline ───────────────────
  // This is also exposed as a raw Express route at /api/pipeline/articles
  // for the Python script (which uses requests.post, not tRPC)
  submit: publicProcedure
    .input(
      z.object({
        token: z.string(),
        title: z.string().min(5).max(500),
        excerpt: z.string().max(1000).optional(),
        content: z.string().min(50),
        category: z.string().optional(),
        vertical: z
          .enum([
            "gaming",
            "tv-streaming",
            "music-movies",
            "comics-cosplay-anime",
            "technology-culture",
          ])
          .optional(),
        tags: z.array(z.string()).optional(),
        seo_keywords: z.array(z.string()).optional(),
        author_slug: z.string().optional(),
        citations: z
          .array(z.object({ label: z.string(), url: z.string(), note: z.string().optional() }))
          .optional(),
        status: z.enum(["draft", "pending"]).default("draft"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Validate token
      const tokenRow = await db
        .select()
        .from(pipelineTokens)
        .where(eq(pipelineTokens.token, input.token))
        .limit(1);

      if (!tokenRow[0] || !tokenRow[0].isActive) {
        throw new Error("Invalid or revoked pipeline token");
      }

      // Update lastUsedAt
      await db
        .update(pipelineTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(pipelineTokens.id, tokenRow[0].id));

      // Resolve author name from slug
      let authorName = "BLRD Staff";
      if (input.author_slug) {
        const authorRow = await db
          .select()
          .from(authors)
          .where(eq(authors.slug, input.author_slug))
          .limit(1);
        if (authorRow[0]) authorName = authorRow[0].name;
      }

      // Map vertical to category
      const mappedCategory = input.vertical
        ? verticalToCategoryMap[input.vertical] ?? "culture"
        : (input.category as "gaming" | "film" | "tv" | "comics" | "tech" | "culture" | "events" | "creators") ?? "culture";

      // Generate unique slug
      const baseSlug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 200);
      const slug = `${baseSlug}-${Date.now()}`;

      // Merge tags + seo_keywords
      const allTags = [...(input.tags ?? []), ...(input.seo_keywords ?? [])];

      await db.insert(articles).values({
        slug,
        title: input.title,
        subhead: input.excerpt ?? null,
        body: input.content,
        category: mappedCategory,
        vertical: input.vertical ?? null,
        type: "news",
        tags: allTags.length > 0 ? JSON.stringify(allTags) : null,
        authorName,
        authorSlug: input.author_slug ?? null,
        citations: input.citations ? JSON.stringify(input.citations) : null,
        status: input.status,
        source: "pipeline",
        isFeatured: false,
        viewCount: 0,
        publishedAt: new Date(),
      });

      // Increment author article count
      if (input.author_slug) {
        await db
          .update(authors)
          .set({ articleCount: sql`${authors.articleCount} + 1` })
          .where(eq(authors.slug, input.author_slug));
      }

      return { success: true, slug };
    }),
});
