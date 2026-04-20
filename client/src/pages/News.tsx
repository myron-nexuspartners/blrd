import { useState, useMemo } from "react";
import { Link, useSearch, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Search, Clock, TrendingUp } from "lucide-react";
import { Byline } from "@/components/Byline";

// Primary categories (top-level nav)
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "gaming", label: "Gaming" },
  { id: "film", label: "Movies" },
  { id: "tv", label: "TV" },
  { id: "comics", label: "Comics" },
  { id: "tech", label: "Tech" },
  { id: "culture", label: "Culture" },
  { id: "events", label: "Events" },
  { id: "creators", label: "Creators" },
];

// 5 content verticals (subcategories per architecture doc)
const VERTICALS = [
  { id: "all", label: "All Verticals" },
  { id: "gaming", label: "Gaming", color: "#1BC9C9" },
  { id: "tv-streaming", label: "TV / Streaming", color: "#a855f7" },
  { id: "music-movies", label: "Music & Movies", color: "#FF5722" },
  { id: "comics-cosplay-anime", label: "Comics, Cosplay & Anime", color: "#eab308" },
  { id: "technology-culture", label: "Technology & Culture", color: "#22c55e" },
];

// Map vertical → article category for filtering
const VERTICAL_TO_CATEGORY: Record<string, string[]> = {
  "gaming": ["gaming"],
  "tv-streaming": ["tv"],
  "music-movies": ["film"],
  "comics-cosplay-anime": ["comics", "culture"],
  "technology-culture": ["tech", "culture"],
};

// Map article author to beat writer slug for bylines
const AUTHOR_SLUG_MAP: Record<string, string> = {
  "Marcus Webb": "kai-reeves",
  "Keisha Daniels": "noor-bensalem",
  "Jordan Price": "sol-carter",
  "Tanya Rivers": "amara-desta",
  "Devon Clarke": "taye-adeyemi",
  "Simone Hart": "noor-bensalem",
};

const SORT_OPTIONS = [
  { id: "latest", label: "Latest", icon: <Clock size={12} /> },
  { id: "popular", label: "Most Popular", icon: <TrendingUp size={12} /> },
];

const ALL_ARTICLES = [
  {
    id: 1, category: "gaming", tag: "gaming",
    title: "The Rise of Indie Games Featuring Diverse Protagonists Is Reshaping the Industry",
    subhead: "How small studios are filling the representation gap that major publishers keep ignoring.",
    author: "Marcus Webb", timeAgo: "2h ago", comments: 42, featured: true,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    readTime: "6 min read",
  },
  {
    id: 2, category: "comics", tag: "comics",
    title: "Miles Morales at 15: How One Character Changed What Superhero Stories Could Be",
    subhead: "A look back at the cultural impact of Marvel's Spider-Man and what comes next.",
    author: "Keisha Daniels", timeAgo: "4h ago", comments: 78, featured: true,
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    readTime: "8 min read",
  },
  {
    id: 3, category: "film", tag: "film",
    title: "Afrofuturism in Film: The Genre That Refuses to Stay Niche",
    subhead: "From Black Panther to Nope — why these films matter beyond the box office.",
    author: "Jordan Price", timeAgo: "6h ago", comments: 55, featured: false,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    readTime: "10 min read",
  },
  {
    id: 4, category: "tv", tag: "tv",
    title: "Streaming Wars 2025: Who's Actually Winning the Battle for Geek Culture Audiences?",
    subhead: "Netflix, Max, Disney+, and Peacock are all fighting for the same eyeballs.",
    author: "Tanya Rivers", timeAgo: "8h ago", comments: 31, featured: false,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80",
    readTime: "7 min read",
  },
  {
    id: 5, category: "tech", tag: "tech",
    title: "AI in Game Development: Creative Tool or Threat to Diverse Storytelling?",
    subhead: "The debate heating up across studios and the communities that care most.",
    author: "Devon Clarke", timeAgo: "10h ago", comments: 88, featured: false,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    readTime: "9 min read",
  },
  {
    id: 6, category: "culture", tag: "culture",
    title: "The Oral History of Black Cosplay: Community, Craft, and Visibility",
    subhead: "Cosplayers share their stories of building community at conventions.",
    author: "Simone Hart", timeAgo: "12h ago", comments: 44, featured: false,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    readTime: "12 min read",
  },
  {
    id: 7, category: "events", tag: "events",
    title: "BlerdCon 2025 Announces Full Programming Schedule",
    subhead: "Three days of panels, gaming, and community at the DMV's premier geek event.",
    author: "BLRD Staff", timeAgo: "1d ago", comments: 19, featured: false,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    readTime: "3 min read",
  },
  {
    id: 8, category: "creators", tag: "creators",
    title: "How This Twitch Streamer Built a 100K Community Without Compromising Her Vision",
    subhead: "Authenticity over algorithms — a masterclass in community building.",
    author: "Marcus Webb", timeAgo: "1d ago", comments: 33, featured: false,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    readTime: "8 min read",
  },
  {
    id: 9, category: "gaming", tag: "gaming",
    title: "Elden Ring's Shadow of the Erdtree DLC Gets a Surprise Sequel Announcement",
    subhead: "FromSoftware drops the news fans didn't see coming.",
    author: "Devon Clarke", timeAgo: "1d ago", comments: 156, featured: false,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    readTime: "4 min read",
  },
  {
    id: 10, category: "comics", tag: "comics",
    title: "DC's New 'Absolute Universe' Reboot: Everything You Need to Know",
    subhead: "The publisher's boldest creative gamble in a decade.",
    author: "Keisha Daniels", timeAgo: "2d ago", comments: 67, featured: false,
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=600&q=80",
    readTime: "6 min read",
  },
  {
    id: 11, category: "film", tag: "film",
    title: "Jordan Peele's Next Project Is Officially in Production",
    subhead: "The horror auteur returns with something unexpected.",
    author: "Jordan Price", timeAgo: "2d ago", comments: 89, featured: false,
    image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    readTime: "3 min read",
  },
  {
    id: 12, category: "tv", tag: "tv",
    title: "Andor Season 2 Review: The Best Star Wars Content in Years",
    subhead: "Political, tense, and beautifully crafted — this is what Star Wars can be.",
    author: "Tanya Rivers", timeAgo: "3d ago", comments: 201, featured: false,
    image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=600&q=80",
    readTime: "11 min read",
  },
  {
    id: 13, category: "tech", tag: "tech",
    title: "Steam Deck 2 Specs Leaked: Here's What We Know",
    subhead: "The next-gen handheld could change portable gaming forever.",
    author: "Devon Clarke", timeAgo: "3d ago", comments: 143, featured: false,
    image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80",
    readTime: "5 min read",
  },
  {
    id: 14, category: "culture", tag: "culture",
    title: "Why Geek Culture Conventions Are Becoming More Inclusive — And Why It Matters",
    subhead: "Convention culture is evolving, and the community is leading the charge.",
    author: "Simone Hart", timeAgo: "4d ago", comments: 38, featured: false,
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&q=80",
    readTime: "7 min read",
  },
  {
    id: 15, category: "gaming", tag: "gaming",
    title: "Best RPGs of 2025 So Far: Our Running List",
    subhead: "From massive open worlds to intimate narrative experiences.",
    author: "Marcus Webb", timeAgo: "4d ago", comments: 72, featured: false,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    readTime: "8 min read",
  },
];

function ArticleCard({ article, large = false }: { article: typeof ALL_ARTICLES[0]; large?: boolean }) {
  const [, navigate] = useLocation();
  if (large) {
    return (
      <div
        className="blrd-card group cursor-pointer overflow-hidden"
        onClick={() => navigate(`/news/${article.id}`)}
        role="article"
      >
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
          <div className="flex items-center justify-between gap-3">
            <Byline
              authorName={article.author}
              authorSlug={AUTHOR_SLUG_MAP[article.author]}
              compact
            />
            <span className="text-xs" style={{ color: "var(--blrd-gray)" }}>💬 {article.comments}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="blrd-card flex gap-3 p-3 group cursor-pointer"
      onClick={() => navigate(`/news/${article.id}`)}
      role="article"
    >
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
        <div className="flex items-center justify-between gap-2">
          <Byline
            authorName={article.author}
            authorSlug={AUTHOR_SLUG_MAP[article.author]}
            compact
          />
          <span className="text-xs shrink-0" style={{ color: "var(--blrd-gray)" }}>{article.readTime}</span>
        </div>
      </div>
    </div>
  );
}

export default function News() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialCategory = params.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeVertical, setActiveVertical] = useState("all");

  const filtered = useMemo(() => {
    let list = [...ALL_ARTICLES];
    if (activeCategory !== "all") {
      list = list.filter((a) => a.category === activeCategory);
    }
    // Vertical sub-filter
    if (activeVertical !== "all") {
      const allowedCategories = VERTICAL_TO_CATEGORY[activeVertical] ?? [];
      list = list.filter((a) => allowedCategories.includes(a.category));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) => a.title.toLowerCase().includes(q) || a.subhead.toLowerCase().includes(q)
      );
    }
    if (sortBy === "popular") {
      list = list.sort((a, b) => b.comments - a.comments);
    }
    return list;
  }, [activeCategory, sortBy, searchQuery]);

  const featured = filtered.filter((a) => a.featured).slice(0, 2);
  const rest = filtered.filter((a) => !a.featured);

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
              background: "var(--blrd-dark-2)",
              borderColor: "var(--blrd-border)",
              color: "var(--blrd-white)",
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
                background: sortBy === opt.id ? "var(--blrd-cyan)" : "var(--blrd-dark-2)",
                borderColor: sortBy === opt.id ? "var(--blrd-cyan)" : "var(--blrd-border)",
                color: sortBy === opt.id ? "var(--blrd-black)" : "var(--blrd-gray-light)",
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Subcategory Filters */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--blrd-gray)" }}>Vertical</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {VERTICALS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVertical(v.id)}
              className="px-3 py-1 text-xs rounded-full border transition-all font-ui font-semibold tracking-wide"
              style={{
                background: activeVertical === v.id ? (v.color ?? "var(--blrd-cyan)") : "transparent",
                borderColor: activeVertical === v.id ? (v.color ?? "var(--blrd-cyan)") : "var(--blrd-border)",
                color: activeVertical === v.id ? "#000" : "var(--blrd-gray-light)",
              }}
            >
              {v.label}
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
              background: activeCategory === cat.id ? "var(--blrd-cyan)" : "var(--blrd-dark-2)",
              borderColor: activeCategory === cat.id ? "var(--blrd-cyan)" : "var(--blrd-border)",
              color: activeCategory === cat.id ? "var(--blrd-black)" : "var(--blrd-gray-light)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Articles */}
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
          <h2>{activeCategory === "all" ? "All Articles" : CATEGORIES.find((c) => c.id === activeCategory)?.label}</h2>
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
