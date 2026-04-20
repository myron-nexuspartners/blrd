import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Search, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  { id: "all",      label: "All"      },
  { id: "gaming",   label: "Gaming"   },
  { id: "film",     label: "Movies"   },
  { id: "tv",       label: "TV"       },
  { id: "comics",   label: "Comics"   },
  { id: "tech",     label: "Tech"     },
  { id: "culture",  label: "Culture"  },
  { id: "events",   label: "Events"   },
  { id: "creators", label: "Creators" },
];

const SORT_OPTIONS = [
  { id: "latest",  label: "Latest",       icon: <Clock size={12} />      },
  { id: "popular", label: "Most Popular", icon: <TrendingUp size={12} /> },
];

// Placeholder articles — visible while DB is empty or loading
const PLACEHOLDER_ARTICLES = [
  {
    id: 1, slug: "placeholder-1", category: "gaming", tag: "gaming",
    title: "The Rise of Indie Games Featuring Diverse Protagonists Is Reshaping the Industry",
    subhead: "How small studios are filling the representation gap that major publishers keep ignoring.",
    author: "Marcus Webb", timeAgo: "2h ago", viewCount: 42, featured: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    readTime: "6 min read",
  },
  {
    id: 2, slug: "placeholder-2", category: "comics", tag: "comics",
    title: "Miles Morales at 15: How One Character Changed What Superhero Stories Could Be",
    subhead: "A look back at the cultural impact of Marvel's Spider-Man and what comes next.",
    author: "Keisha Daniels", timeAgo: "4h ago", viewCount: 78, featured: true,
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    readTime: "8 min read",
  },
  {
    id: 3, slug: "placeholder-3", category: "film", tag: "film",
    title: "Afrofuturism in Film: The Genre That Refuses to Stay Niche",
    subhead: "From Black Panther to Nope — why these films matter beyond the box office.",
    author: "Jordan Price", timeAgo: "6h ago", viewCount: 55, featured: false,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    readTime: "10 min read",
  },
  {
    id: 4, slug: "placeholder-4", category: "tv", tag: "tv",
    title: "Streaming Wars 2025: Who's Actually Winning the Battle for Geek Culture Audiences?",
    subhead: "Netflix, Max, Disney+, and Peacock are all fighting for the same eyeballs.",
    author: "Tanya Rivers", timeAgo: "8h ago", viewCount: 31, featured: false,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80",
    readTime: "7 min read",
  },
  {
    id: 5, slug: "placeholder-5", category: "tech", tag: "tech",
    title: "AI in Game Development: Creative Tool or Threat to Diverse Storytelling?",
    subhead: "The debate heating up across studios and the communities that care most.",
    author: "Devon Clarke", timeAgo: "10h ago", viewCount: 88, featured: false,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    readTime: "9 min read",
  },
  {
    id: 6, slug: "placeholder-6", category: "culture", tag: "culture",
    title: "The Oral History of Black Cosplay: Community, Craft, and Visibility",
    subhead: "Cosplayers share their stories of building community at conventions.",
    author: "Simone Hart", timeAgo: "12h ago", viewCount: 44, featured: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    readTime: "12 min read",
  },
];

// Map a DB article row to the shape ArticleCard expects
function normaliseArticle(a: any) {
  const wordCount = (a.body ?? "").split(/\s+/).length;
  const readMins  = Math.max(1, Math.round(wordCount / 200));
  return {
    id:        a.id,
    slug:      a.slug,
    category:  a.category,
    tag:       a.category,
    title:     a.title,
    subhead:   a.subhead ?? "",
    author:    a.authorName ?? "BLRD Staff",
    timeAgo:   a.publishedAt
                 ? formatDistanceToNow(new Date(a.publishedAt), { addSuffix: true })
                 : "",
    viewCount: a.viewCount ?? 0,
    featured:  a.isFeatured ?? false,
    image:     a.imageUrl ?? "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    readTime:  `${readMins} min read`,
  };
}

type NormalisedArticle = ReturnType<typeof normaliseArticle>;

function ArticleCard({ article, large = false }: { article: NormalisedArticle; large?: boolean }) {
  if (large) {
    return (
      <Link href={`/news/${article.slug}`}>
        <div className="blrd-card group cursor-pointer overflow-hidden">
          <div className="h-56 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`blrd-tag blrd-tag-${article.tag}`}>{article.category}</span>
              <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>{article.timeAgo}</span>
              <span className="text-xs font-ui ml-auto" style={{ color: "var(--blrd-gray)" }}>{article.readTime}</span>
            </div>
            <h2
              className="font-semibold leading-snug mb-2 text-lg transition-colors group-hover:text-cyan-400"
              style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
            >
              {article.title}
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--blrd-gray)" }}>
              {article.subhead}
            </p>
            <div className="flex items-center gap-3 text-xs" style={{ color: "var(--blrd-gray)" }}>
              <span className="font-ui">By {article.author}</span>
              <span>👁 {article.viewCount}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug}`}>
      <div className="blrd-card flex gap-3 p-3 group cursor-pointer">
        <div className="w-24 h-20 shrink-0 rounded overflow-hidden bg-gray-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`blrd-tag blrd-tag-${article.tag}`}>{article.category}</span>
            <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>{article.timeAgo}</span>
          </div>
          <h3
            className="text-sm font-semibold leading-snug mb-1 line-clamp-2 transition-colors group-hover:text-cyan-400"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
          >
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--blrd-gray)" }}>
            <span className="font-ui">{article.author}</span>
            <span>👁 {article.viewCount}</span>
            <span className="ml-auto">{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function News() {
  const searchStr  = useSearch();
  const params     = new URLSearchParams(searchStr);
  const initialCat = params.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy,         setSortBy]         = useState("latest");
  const [searchQuery,    setSearchQuery]    = useState("");

  // Live query — returns [] until published articles exist in DB
  const { data: dbArticles = [] } = trpc.articles.list.useQuery(
    { type: "news", limit: 100 },
    { staleTime: 60_000 }
  );

  // Use live DB data when available; fall back to placeholders
  const allArticles: NormalisedArticle[] = useMemo(
    () => (dbArticles.length > 0 ? dbArticles.map(normaliseArticle) : PLACEHOLDER_ARTICLES),
    [dbArticles]
  );

  const filtered = useMemo(() => {
    let list = [...allArticles];
    if (activeCategory !== "all") {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.subhead ?? "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "popular") {
      list = list.sort((a, b) => b.viewCount - a.viewCount);
    }
    return list;
  }, [allArticles, activeCategory, sortBy, searchQuery]);

  const featured = filtered.filter((a) => a.featured).slice(0, 2);
  const rest     = filtered.filter((a) => !a.featured);

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display text-xl font-bold" style={{ color: "var(--blrd-white)" }}>
            News
          </h1>
          <span
            className="text-xs font-ui px-2 py-0.5 rounded"
            style={{ background: "var(--blrd-dark-3)", color: "var(--blrd-gray)" }}
          >
            {filtered.length} articles
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--blrd-gray)" }}>
          Breaking news and features from gaming, comics, film, TV, tech, and culture.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--blrd-gray)" }} />
          <input
            type="search"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded border outline-none"
            style={{
              background:  "var(--blrd-dark-2)",
              borderColor: "var(--blrd-border)",
              color:       "var(--blrd-white)",
            }}
          />
        </div>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs rounded border transition-all font-ui font-semibold"
              style={{
                background:  sortBy === opt.id ? "var(--blrd-cyan)"  : "var(--blrd-dark-2)",
                borderColor: sortBy === opt.id ? "var(--blrd-cyan)"  : "var(--blrd-border)",
                color:       sortBy === opt.id ? "var(--blrd-black)" : "var(--blrd-gray-light)",
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-3 py-1.5 text-xs rounded border transition-all font-ui font-semibold tracking-wide"
            style={{
              background:  activeCategory === cat.id ? "var(--blrd-cyan)"  : "var(--blrd-dark-2)",
              borderColor: activeCategory === cat.id ? "var(--blrd-cyan)"  : "var(--blrd-border)",
              color:       activeCategory === cat.id ? "var(--blrd-black)" : "var(--blrd-gray-light)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-6">
          <div className="section-header">
            <h2>Featured</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.map((a) => (
              <ArticleCard key={a.id} article={a} large />
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div>
        <div className="section-header">
          <h2>
            {activeCategory === "all"
              ? "All Articles"
              : CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div
            className="rounded p-12 text-center"
            style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
          >
            <p className="text-sm" style={{ color: "var(--blrd-gray)" }}>
              No articles found matching your search.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(featured.length > 0 ? rest : filtered).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
