/**
 * BLRD Content Pipeline — REST endpoint
 *
 * Exposes POST /api/pipeline/articles for the Python content agent.
 * This is a thin Express wrapper around the tRPC pipeline.submit procedure
 * so the Python requests.post() call works without a tRPC client.
 *
 * Python usage (replace the WordPress publish step):
 * ─────────────────────────────────────────────────
 * import requests
 *
 * BLRD_API_URL = "https://your-blrd-site.manus.space/api/pipeline/articles"
 * BLRD_TOKEN   = "your_pipeline_token_from_admin_dashboard"
 *
 * def publish_to_blrd(article: dict) -> dict:
 *     payload = {
 *         "token":       BLRD_TOKEN,
 *         "title":       article["title"],
 *         "excerpt":     article.get("excerpt", ""),
 *         "content":     article["content"],
 *         "vertical":    article.get("vertical"),   # e.g. "gaming"
 *         "tags":        article.get("tags", []),
 *         "seo_keywords": article.get("seo_keywords", []),
 *         "author_slug": article.get("author_slug"),  # e.g. "kai-reeves"
 *         "citations":   article.get("citations", []),
 *         "status":      "draft",  # or "pending" to trigger admin review
 *     }
 *     r = requests.post(BLRD_API_URL, json=payload, timeout=30)
 *     r.raise_for_status()
 *     return r.json()
 * ─────────────────────────────────────────────────
 *
 * Vertical → author_slug mapping:
 *   gaming              → kai-reeves
 *   tv-streaming        → amara-desta
 *   music-movies        → sol-carter
 *   comics-cosplay-anime → noor-bensalem
 *   technology-culture  → taye-adeyemi
 */

import type { Express, Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { articles, pipelineTokens, authors } from "../drizzle/schema";
import { getDb } from "./db";

// Vertical → category mapping (mirrors pipeline.ts)
const VERTICAL_TO_CATEGORY: Record<string, string> = {
  "gaming": "gaming",
  "tv-streaming": "tv",
  "music-movies": "film",
  "comics-cosplay-anime": "comics",
  "technology-culture": "tech",
};

export function registerPipelineRoute(app: Express): void {
  // ─── POST /api/pipeline/articles ─────────────────────────────────────────
  app.post("/api/pipeline/articles", async (req: Request, res: Response) => {
    try {
      const {
        token,
        title,
        excerpt,
        content,
        vertical,
        category: rawCategory,
        tags,
        seo_keywords,
        author_slug,
        citations,
        status = "draft",
      } = req.body as {
        token?: string;
        title?: string;
        excerpt?: string;
        content?: string;
        vertical?: string;
        category?: string;
        tags?: string[];
        seo_keywords?: string[];
        author_slug?: string;
        citations?: { label: string; url: string; note?: string }[];
        status?: "draft" | "pending";
      };

      // ── Validate required fields ─────────────────────────────────────────
      if (!token) return res.status(401).json({ error: "Missing token" });
      if (!title || !content) {
        return res.status(400).json({ error: "title and content are required" });
      }

      const db = await getDb();
      if (!db) return res.status(503).json({ error: "Database unavailable" });

      // ── Validate token ───────────────────────────────────────────────────
      const tokenRows = await db
        .select()
        .from(pipelineTokens)
        .where(eq(pipelineTokens.token, token))
        .limit(1);

      const tokenRow = tokenRows[0];
      if (!tokenRow || !tokenRow.isActive) {
        return res.status(403).json({ error: "Invalid or revoked pipeline token" });
      }

      // Update lastUsedAt
      await db
        .update(pipelineTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(pipelineTokens.id, tokenRow.id));

      // ── Resolve author ───────────────────────────────────────────────────
      let authorName = "BLRD Staff";
      if (author_slug) {
        const authorRows = await db
          .select()
          .from(authors)
          .where(eq(authors.slug, author_slug))
          .limit(1);
        if (authorRows[0]) authorName = authorRows[0].name;
      }

      // ── Map vertical → category ──────────────────────────────────────────
      const mappedCategory = vertical
        ? VERTICAL_TO_CATEGORY[vertical] ?? "culture"
        : rawCategory ?? "culture";

      // ── Generate unique slug ─────────────────────────────────────────────
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 200);
      const slug = `${baseSlug}-${Date.now()}`;

      // ── Merge tags + seo_keywords ────────────────────────────────────────
      const allTags = [...(tags ?? []), ...(seo_keywords ?? [])];

      // ── Insert article ───────────────────────────────────────────────────
      await db.insert(articles).values({
        slug,
        title,
        subhead: excerpt ?? null,
        body: content,
        category: mappedCategory as "gaming" | "film" | "tv" | "comics" | "tech" | "culture" | "events" | "creators",
        vertical: vertical as "gaming" | "tv-streaming" | "music-movies" | "comics-cosplay-anime" | "technology-culture" | null ?? null,
        type: "news",
        tags: allTags.length > 0 ? JSON.stringify(allTags) : null,
        authorName,
        authorSlug: author_slug ?? null,
        citations: citations ? JSON.stringify(citations) : null,
        status: status === "draft" ? "draft" : "pending",
        source: "pipeline",
        isFeatured: false,
        viewCount: 0,
        publishedAt: new Date(),
      });

      // ── Increment author article count ───────────────────────────────────
      if (author_slug) {
        await db
          .update(authors)
          .set({ articleCount: sql`${authors.articleCount} + 1` })
          .where(eq(authors.slug, author_slug));
      }

      return res.status(201).json({
        success: true,
        slug,
        message: `Article "${title}" submitted as ${status}. Review in the BLRD Admin Dashboard.`,
      });
    } catch (err) {
      console.error("[Pipeline] Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // ─── GET /api/pipeline/health ─────────────────────────────────────────────
  app.get("/api/pipeline/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "BLRD Content Pipeline API",
      version: "1.0",
      endpoints: {
        "POST /api/pipeline/articles": "Submit article from content pipeline",
        "GET /api/pipeline/health": "Health check",
      },
      verticals: [
        "gaming",
        "tv-streaming",
        "music-movies",
        "comics-cosplay-anime",
        "technology-culture",
      ],
      authors: [
        { slug: "kai-reeves", vertical: "gaming" },
        { slug: "amara-desta", vertical: "tv-streaming" },
        { slug: "sol-carter", vertical: "music-movies" },
        { slug: "noor-bensalem", vertical: "comics-cosplay-anime" },
        { slug: "taye-adeyemi", vertical: "technology-culture" },
      ],
    });
  });
}
