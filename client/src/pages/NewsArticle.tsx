import { useEffect } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Clock, Eye } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readTime(body: string) {
  const words = (body ?? "").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function categoryLabel(cat: string) {
  const MAP: Record<string, string> = {
    gaming: "Gaming",
    film: "Movies",
    tv: "TV",
    comics: "Comics",
    tech: "Tech",
    culture: "Culture",
    events: "Events",
    creators: "Creators",
  };
  return MAP[cat] ?? cat;
}

function formatBody(body: string) {
  // Split on double newlines, render each paragraph
  const NL = String.fromCharCode(10);
  return body
    .split(NL + NL)
    .map((para, i) => (
      <p
        key={i}
        className="leading-relaxed mb-4 text-base"
        style={{ color: "var(--blrd-gray-light)" }}
        dangerouslySetInnerHTML={{
          __html: para
            .split(NL).join("<br/>")
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>"),
        }}
      />
    ));
}

// ─── Related Card ─────────────────────────────────────────────────────────────

function RelatedCard({ article }: { article: any }) {
  const wordCount = (article.body ?? "").split(/\s+/).length;
  const mins = Math.max(1, Math.round(wordCount / 200));
  const image =
    article.imageUrl ??
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=70";

  return (
    <Link href={`/news/${article.slug}`}>
      <div className="blrd-card flex gap-3 p-3 group cursor-pointer">
        <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-800">
          <img
            src={image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={`blrd-tag blrd-tag-${article.category} mb-1 inline-block`}
          >
            {categoryLabel(article.category)}
          </span>
          <h4
            className="text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-cyan-400"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
          >
            {article.title}
          </h4>
          <span
            className="text-xs font-ui"
            style={{ color: "var(--blrd-gray)" }}
          >
            {mins} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewsArticle() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  // Fetch article
  const { data: article, isLoading, isError } = trpc.articles.bySlug.useQuery(
    { slug },
    { enabled: !!slug, staleTime: 60_000 }
  );

  // Increment view count once on mount
  const viewMutation = trpc.articles.view.useMutation();
  useEffect(() => {
    if (slug) viewMutation.mutate({ slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Fetch related articles once we know the category
  const { data: related = [] } = trpc.articles.related.useQuery(
    { slug, category: article?.category ?? "", limit: 3 },
    { enabled: !!article?.category, staleTime: 60_000 }
  );

  // ── Loading ──
  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col gap-4 animate-pulse">
          <div
            className="h-6 w-32 rounded"
            style={{ background: "var(--blrd-dark-3)" }}
          />
          <div
            className="h-56 rounded"
            style={{ background: "var(--blrd-dark-3)" }}
          />
          <div
            className="h-8 w-3/4 rounded"
            style={{ background: "var(--blrd-dark-3)" }}
          />
          <div
            className="h-4 w-full rounded"
            style={{ background: "var(--blrd-dark-3)" }}
          />
          <div
            className="h-4 w-5/6 rounded"
            style={{ background: "var(--blrd-dark-3)" }}
          />
        </div>
      </Layout>
    );
  }

  // ── Not found / error ──
  if (isError || !article) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--blrd-white)" }}
          >
            Article not found
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--blrd-gray)" }}>
            This story may have been removed or the link is incorrect.
          </p>
          <Link href="/news">
            <button
              className="px-4 py-2 text-sm rounded font-ui font-semibold transition-colors"
              style={{
                background: "var(--blrd-cyan)",
                color: "var(--blrd-black)",
              }}
            >
              Back to News
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  // ── Article ──
  const heroImage =
    article.imageUrl ??
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80";
  const publishedLabel = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : "";

  return (
    <Layout>
      {/* Back link */}
      <Link href="/news">
        <button
          className="flex items-center gap-1.5 text-xs font-ui font-semibold mb-5 transition-colors hover:text-cyan-400"
          style={{ color: "var(--blrd-gray)" }}
        >
          <ArrowLeft size={13} />
          Back to News
        </button>
      </Link>

      {/* Hero image */}
      <div className="rounded overflow-hidden mb-6 h-52 sm:h-72">
        <img
          src={heroImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className={`blrd-tag blrd-tag-${article.category}`}>
          {categoryLabel(article.category)}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-ui"
          style={{ color: "var(--blrd-gray)" }}
        >
          <Clock size={11} />
          {readTime(article.body ?? "")}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-ui"
          style={{ color: "var(--blrd-gray)" }}
        >
          <Eye size={11} />
          {(article.viewCount ?? 0) + 1}
        </span>
        {publishedLabel && (
          <span
            className="text-xs font-ui ml-auto"
            style={{ color: "var(--blrd-gray)" }}
          >
            {publishedLabel}
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        className="font-display text-2xl sm:text-3xl font-bold leading-snug mb-3"
        style={{ color: "var(--blrd-white)" }}
      >
        {article.title}
      </h1>

      {/* Subhead */}
      {article.subhead && (
        <p
          className="text-base leading-relaxed mb-4 font-medium"
          style={{ color: "var(--blrd-gray-light)" }}
        >
          {article.subhead}
        </p>
      )}

      {/* Byline */}
      <div
        className="flex items-center gap-2 pb-4 mb-6 border-b text-sm font-ui"
        style={{
          borderColor: "var(--blrd-border)",
          color: "var(--blrd-gray)",
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: "var(--blrd-cyan)",
            color: "var(--blrd-black)",
          }}
        >
          {(article.authorName ?? "B")[0].toUpperCase()}
        </div>
        <span>
          By{" "}
          <span style={{ color: "var(--blrd-white)" }}>
            {article.authorName ?? "BLRD Staff"}
          </span>
        </span>
      </div>

      {/* Body */}
      <article className="mb-10">{formatBody(article.body ?? "")}</article>

      {/* Tags */}
      {article.tags && (() => {
        let tags: string[] = [];
        try { tags = JSON.parse(article.tags); } catch { tags = []; }
        return tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded border font-ui"
                style={{
                  background: "var(--blrd-dark-2)",
                  borderColor: "var(--blrd-border)",
                  color: "var(--blrd-gray-light)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null;
      })()}

      {/* Related Articles */}
      {related.length > 0 && (
        <div>
          <div className="section-header mb-3">
            <h2>More from{" "}
              <span style={{ color: "var(--blrd-cyan)" }}>
                {categoryLabel(article.category)}
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {related.map((rel: any) => (
              <RelatedCard key={rel.id} article={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div
        className="mt-10 rounded p-5 text-center border"
        style={{
          background: "var(--blrd-dark-2)",
          borderColor: "var(--blrd-border)",
        }}
      >
        <p
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--blrd-white)" }}
        >
          Stay sharp. More from BLRD.
        </p>
        <Link href="/news">
          <button
            className="px-4 py-2 text-sm rounded font-ui font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "var(--blrd-cyan)",
              color: "var(--blrd-black)",
            }}
          >
            Browse All Stories
          </button>
        </Link>
      </div>
    </Layout>
  );
}
