import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Pen, Twitter } from "lucide-react";

// ─── Vertical label map ───────────────────────────────────────────────────────
const VERTICAL_LABELS: Record<string, string> = {
  "gaming": "Gaming",
  "tv-streaming": "TV / Streaming",
  "music-movies": "Music & Movies",
  "comics-cosplay-anime": "Comics, Cosplay & Anime",
  "technology-culture": "Technology & Culture",
  "editorial": "Editorial",
};

const VERTICAL_COLORS: Record<string, string> = {
  "gaming": "bg-[#1BC9C9]/20 text-[#1BC9C9] border-[#1BC9C9]/30",
  "tv-streaming": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "music-movies": "bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30",
  "comics-cosplay-anime": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "technology-culture": "bg-green-500/20 text-green-400 border-green-500/30",
  "editorial": "bg-white/20 text-white border-white/30",
};

// ─── Author Card ──────────────────────────────────────────────────────────────
function AuthorCard({ author }: { author: { slug: string; name: string; title?: string | null; shortBio?: string | null; vertical: string; twitterHandle?: string | null; articleCount: number } }) {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/authors/${author.slug}`}>
      <Card className="bg-zinc-900 border-zinc-800 hover:border-[#1BC9C9]/50 transition-all duration-200 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1BC9C9] to-[#FF5722] flex items-center justify-center flex-shrink-0 text-black font-bold text-xl font-['Metropolis',sans-serif]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg group-hover:text-[#1BC9C9] transition-colors font-['Metropolis',sans-serif]">
                {author.name}
              </h3>
              {author.title && (
                <p className="text-zinc-400 text-sm mb-2">{author.title}</p>
              )}
              <Badge className={`text-xs border ${VERTICAL_COLORS[author.vertical] ?? "bg-zinc-700 text-zinc-300"} mb-3`}>
                {VERTICAL_LABELS[author.vertical] ?? author.vertical}
              </Badge>
              {author.shortBio && (
                <p className="text-zinc-400 text-sm line-clamp-2">{author.shortBio}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-zinc-500 text-xs">
                <span className="flex items-center gap-1">
                  <Pen className="w-3 h-3" />
                  {author.articleCount} articles
                </span>
                {author.twitterHandle && (
                  <span className="flex items-center gap-1">
                    <Twitter className="w-3 h-3" />
                    {author.twitterHandle}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Authors Listing Page ─────────────────────────────────────────────────────
export function AuthorsPage() {
  const { data: authorsList, isLoading } = trpc.authors.list.useQuery();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 font-['Metropolis',sans-serif] uppercase tracking-wider">
            Meet the <span className="text-[#1BC9C9]">Writers</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            BLRD's beat writers bring sharp analysis, cultural fluency, and authentic passion to every story. Five verticals. Five voices. One mentality.
          </p>
        </div>

        <Separator className="bg-zinc-800 mb-8" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-40 bg-zinc-900 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(authorsList ?? []).map((author) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Single Author Profile Page ───────────────────────────────────────────────
export function AuthorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: author, isLoading: authorLoading } = trpc.authors.bySlug.useQuery({ slug: slug ?? "" });
  const { data: authorArticles, isLoading: articlesLoading } = trpc.authors.articles.useQuery(
    { slug: slug ?? "", limit: 20 },
    { enabled: !!slug }
  );

  if (authorLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1BC9C9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Author not found</h1>
        <Link href="/authors" className="text-[#1BC9C9] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Writers
        </Link>
      </div>
    );
  }

  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link href="/authors" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#1BC9C9] text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Writers
        </Link>

        {/* Author Hero */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1BC9C9] to-[#FF5722] flex items-center justify-center flex-shrink-0 text-black font-bold text-3xl font-['Metropolis',sans-serif]">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white mb-1 font-['Metropolis',sans-serif] uppercase tracking-wide">
              {author.name}
            </h1>
            {author.title && (
              <p className="text-[#1BC9C9] font-semibold mb-3">{author.title}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`border ${VERTICAL_COLORS[author.vertical] ?? "bg-zinc-700 text-zinc-300"}`}>
                {VERTICAL_LABELS[author.vertical] ?? author.vertical}
              </Badge>
              <span className="text-zinc-500 text-sm flex items-center gap-1">
                <Pen className="w-3 h-3" /> {author.articleCount} articles
              </span>
              {author.twitterHandle && (
                <span className="text-zinc-500 text-sm flex items-center gap-1">
                  <Twitter className="w-3 h-3" /> {author.twitterHandle}
                </span>
              )}
            </div>
            {author.bio && (
              <p className="text-zinc-300 leading-relaxed">{author.bio}</p>
            )}
          </div>
        </div>

        <Separator className="bg-zinc-800 mb-8" />

        {/* Articles by this author */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 font-['Metropolis',sans-serif] uppercase tracking-wider">
            Latest from <span className="text-[#1BC9C9]">{author.name.split(" ")[0]}</span>
          </h2>

          {articlesLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-zinc-900 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !authorArticles || authorArticles.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Pen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No published articles yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {authorArticles.map((article) => (
                <Card key={article.id} className="bg-zinc-900 border-zinc-800 hover:border-[#1BC9C9]/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400 capitalize">
                            {article.vertical
                              ? VERTICAL_LABELS[article.vertical]
                              : article.category}
                          </Badge>
                          <span className="text-zinc-600 text-xs">
                            {new Date(article.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base leading-snug hover:text-[#1BC9C9] transition-colors cursor-pointer">
                          {article.title}
                        </h3>
                        {article.subhead && (
                          <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{article.subhead}</p>
                        )}
                      </div>
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-20 h-16 object-cover rounded flex-shrink-0"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthorsPage;
