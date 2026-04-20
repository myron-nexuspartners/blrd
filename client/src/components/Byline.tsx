/**
 * Byline Component
 * Displays: By [Author Name] | BLRD [Vertical] | [Date]
 * Optionally renders a Perplexity-style citation block.
 * Used on article cards, news items, and blog posts.
 */

import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const VERTICAL_LABELS: Record<string, string> = {
  "gaming": "Gaming",
  "tv-streaming": "TV / Streaming",
  "music-movies": "Music & Movies",
  "comics-cosplay-anime": "Comics, Cosplay & Anime",
  "technology-culture": "Technology & Culture",
  "editorial": "Editorial",
};

const VERTICAL_COLORS: Record<string, string> = {
  "gaming": "text-[#1BC9C9]",
  "tv-streaming": "text-purple-400",
  "music-movies": "text-[#FF5722]",
  "comics-cosplay-anime": "text-yellow-400",
  "technology-culture": "text-green-400",
  "editorial": "text-white",
};

interface Citation {
  label: string;
  url: string;
  note?: string;
}

interface BylineProps {
  authorName?: string | null;
  authorSlug?: string | null;
  vertical?: string | null;
  category?: string;
  publishedAt?: Date | string;
  citations?: Citation[] | null;
  compact?: boolean; // compact = single line, no citations
}

export function Byline({
  authorName,
  authorSlug,
  vertical,
  category,
  publishedAt,
  citations,
  compact = false,
}: BylineProps) {
  const verticalLabel = vertical
    ? VERTICAL_LABELS[vertical] ?? vertical
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : null;

  const verticalColor = vertical ? VERTICAL_COLORS[vertical] ?? "text-zinc-400" : "text-zinc-400";

  const dateStr = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const parsedCitations: Citation[] = (() => {
    if (!citations) return [];
    if (typeof citations === "string") {
      try {
        return JSON.parse(citations);
      } catch {
        return [];
      }
    }
    return citations;
  })();

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 flex-wrap">
        {authorName && (
          <>
            <span>By</span>
            {authorSlug ? (
              <Link href={`/authors/${authorSlug}`} className="text-[#1BC9C9] hover:underline font-medium">
                {authorName}
              </Link>
            ) : (
              <span className="text-zinc-300 font-medium">{authorName}</span>
            )}
          </>
        )}
        {verticalLabel && (
          <>
            <span className="text-zinc-700">|</span>
            <span className={`font-medium ${verticalColor}`}>BLRD {verticalLabel}</span>
          </>
        )}
        {dateStr && (
          <>
            <span className="text-zinc-700">|</span>
            <span>{dateStr}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main byline line */}
      <div className="flex items-center gap-1.5 text-sm text-zinc-500 flex-wrap">
        {authorName && (
          <>
            <span>By</span>
            {authorSlug ? (
              <Link href={`/authors/${authorSlug}`} className="text-[#1BC9C9] hover:underline font-semibold">
                {authorName}
              </Link>
            ) : (
              <span className="text-zinc-200 font-semibold">{authorName}</span>
            )}
          </>
        )}
        {verticalLabel && (
          <>
            <span className="text-zinc-700">|</span>
            <span className={`font-semibold ${verticalColor}`}>BLRD {verticalLabel}</span>
          </>
        )}
        {dateStr && (
          <>
            <span className="text-zinc-700">|</span>
            <time className="text-zinc-400">{dateStr}</time>
          </>
        )}
      </div>

      {/* Perplexity-style citation block */}
      {parsedCitations.length > 0 && (
        <div className="border border-zinc-800 rounded-md p-3 bg-zinc-950">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Sources</p>
          <div className="flex flex-wrap gap-2">
            {parsedCitations.map((cite, i) => (
              <a
                key={i}
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                title={cite.note}
                className="inline-flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2 py-1 rounded transition-colors"
              >
                <span className="text-[#1BC9C9] font-bold">[{i + 1}]</span>
                {cite.label}
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Inline citation tag for use within article body text.
 * Usage: <CitationTag index={1} url="https://..." label="IGN" />
 */
export function CitationTag({ index, url, label }: { index: number; url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="inline-flex items-center text-[#1BC9C9] text-xs font-bold hover:underline ml-0.5"
    >
      [{index}]
    </a>
  );
}

export default Byline;
