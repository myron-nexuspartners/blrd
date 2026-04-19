import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { ChevronLeft, ChevronRight, Flame, Play, BookOpen, Tv, Gamepad2, Users } from "lucide-react";

// ─── Hero Banner Data ──────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    category: "Gaming",
    tag: "gaming",
    title: "Level Up Your Game Culture",
    subhead: "From indie gems to AAA blockbusters — BLRD covers it all with an authentic voice that actually gets it.",
    cta: "Explore Gaming",
    ctaHref: "/news?category=gaming",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/hero-gaming_e0fa8e79.jpg",
    accent: "#00d4ff",
  },
  {
    id: 2,
    category: "Comics",
    tag: "comics",
    title: "Every Panel Tells a Story",
    subhead: "Dive deep into the universes that shaped geek culture — reviews, news, and creator spotlights.",
    cta: "Read Comics Coverage",
    ctaHref: "/news?category=comics",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/hero-comics_0f12ea74.jpg",
    accent: "#ff6b00",
  },
  {
    id: 3,
    category: "Movies",
    tag: "film",
    title: "Cinema Through a Different Lens",
    subhead: "Film criticism and coverage that brings fresh perspectives to the stories that move us.",
    cta: "Watch Our Reviews",
    ctaHref: "/reviews",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/hero-movies_9cbedcb0.jpg",
    accent: "var(--blrd-cyan)",
  },
  {
    id: 4,
    category: "Creators",
    tag: "creators",
    title: "Built by Creators, for Creators",
    subhead: "Connecting passionate fans and content creators across gaming, comics, film, and beyond.",
    cta: "Meet the Creators",
    ctaHref: "/discover",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/hero-creators_6a278df8.jpg",
    accent: "#ff4500",
  },
];

// ─── Sample News Data ──────────────────────────────────────────────────────
const POPULAR_ARTICLES = [
  {
    id: 1, tag: "gaming", label: "Gaming",
    title: "The Rise of Indie Games Featuring Diverse Protagonists Is Reshaping the Industry",
    subhead: "How small studios are filling the representation gap that major publishers keep ignoring.",
    comments: 42,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
  },
  {
    id: 2, tag: "comics", label: "Comics",
    title: "Miles Morales at 15: How One Character Changed What Superhero Stories Could Be",
    subhead: "A look back at the cultural impact of Marvel's Spider-Man and what comes next.",
    comments: 78,
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80",
  },
  {
    id: 3, tag: "film", label: "Movies",
    title: "Afrofuturism in Film: The Genre That Refuses to Stay Niche",
    subhead: "From Black Panther to Nope — why these films matter beyond the box office.",
    comments: 55,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
  },
  {
    id: 4, tag: "tv", label: "TV",
    title: "Streaming Wars 2025: Who's Actually Winning the Battle for Geek Culture Audiences?",
    subhead: "Netflix, Max, Disney+, and Peacock are all fighting for the same eyeballs.",
    comments: 31,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80",
  },
  {
    id: 5, tag: "creators", label: "Creators",
    title: "Meet the 10 Content Creators Who Are Redefining Geek Culture Coverage in 2025",
    subhead: "These voices are building communities that mainstream outlets can't replicate.",
    comments: 19,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
  },
  {
    id: 6, tag: "tech", label: "Tech",
    title: "AI in Game Development: Creative Tool or Threat to Diverse Storytelling?",
    subhead: "The debate heating up across studios and the communities that care most.",
    comments: 88,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80",
  },
];

const LATEST_ARTICLES = [
  {
    id: 7, tag: "gaming", label: "Gaming",
    title: "Elden Ring's Shadow of the Erdtree DLC Gets a Surprise Sequel Announcement",
    subhead: "FromSoftware drops the news fans didn't see coming.",
    timeAgo: "2h ago",
  },
  {
    id: 8, tag: "comics", label: "Comics",
    title: "DC's New 'Absolute Universe' Reboot: Everything You Need to Know",
    subhead: "The publisher's boldest creative gamble in a decade.",
    timeAgo: "4h ago",
  },
  {
    id: 9, tag: "film", label: "Movies",
    title: "Jordan Peele's Next Project Is Officially in Production",
    subhead: "The horror auteur returns with something unexpected.",
    timeAgo: "6h ago",
  },
  {
    id: 10, tag: "tv", label: "TV",
    title: "Andor Season 2 Review: The Best Star Wars Content in Years",
    subhead: "Political, tense, and beautifully crafted — this is what Star Wars can be.",
    timeAgo: "8h ago",
  },
  {
    id: 11, tag: "tech", label: "Tech",
    title: "Steam Deck 2 Specs Leaked: Here's What We Know",
    subhead: "The next-gen handheld could change portable gaming forever.",
    timeAgo: "10h ago",
  },
  {
    id: 12, tag: "culture", label: "Culture",
    title: "The Oral History of Black Cosplay: Community, Craft, and Visibility",
    subhead: "Cosplayers share their stories of building community at conventions.",
    timeAgo: "12h ago",
  },
  {
    id: 13, tag: "events", label: "Events",
    title: "BlerdCon 2025 Announces Full Programming Schedule",
    subhead: "Three days of panels, gaming, and community at the DMV's premier geek event.",
    timeAgo: "1d ago",
  },
  {
    id: 14, tag: "creators", label: "Creators",
    title: "How This Twitch Streamer Built a 100K Community Without Compromising Her Vision",
    subhead: "Authenticity over algorithms — a masterclass in community building.",
    timeAgo: "1d ago",
  },
];

const CATEGORY_SECTIONS = [
  {
    id: "gaming", label: "Gaming", icon: <Gamepad2 size={14} />, color: "var(--blrd-cyan)",
    articles: [
      { title: "Best RPGs of 2025 So Far: Our Running List", tag: "gaming" },
      { title: "Tekken 8 Season 3 Patch Notes: Full Breakdown", tag: "gaming" },
      { title: "Why Baldur's Gate 3 Still Matters Two Years Later", tag: "gaming" },
      { title: "The Most Anticipated Games of Q3 2025", tag: "gaming" },
    ],
  },
  {
    id: "comics", label: "Comics", icon: <BookOpen size={14} />, color: "var(--blrd-orange)",
    articles: [
      { title: "Absolute Batman #1 Review: A Dark Knight Reimagined", tag: "comics" },
      { title: "Marvel's Summer of Symbiotes Event Explained", tag: "comics" },
      { title: "5 Indie Comics You Should Be Reading Right Now", tag: "comics" },
      { title: "The Best Graphic Novels of 2025 (Updated Monthly)", tag: "comics" },
    ],
  },
  {
    id: "tv", label: "TV", icon: <Tv size={14} />, color: "var(--blrd-cyan)",
    articles: [
      { title: "The Last of Us Season 3: Everything We Know", tag: "tv" },
      { title: "Fallout Season 2 Renewal: What's Coming Next", tag: "tv" },
      { title: "Arcane Season 2 Retrospective: A Visual Masterpiece", tag: "tv" },
      { title: "Best Sci-Fi Shows Streaming Right Now", tag: "tv" },
    ],
  },
  {
    id: "creators", label: "Creators", icon: <Users size={14} />, color: "var(--blrd-flame)",
    articles: [
      { title: "Creator Spotlight: The Podcasters Changing Gaming Discourse", tag: "creators" },
      { title: "How to Build a Geek Culture Brand in 2025", tag: "creators" },
      { title: "The Best Gaming YouTube Channels You're Not Watching", tag: "creators" },
      { title: "Community Voices: Fan Fiction as Cultural Commentary", tag: "creators" },
    ],
  },
];

// ─── Flame Rating Display ─────────────────────────────────────────────────
function FlameDisplay({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="flame-rating" title={`${rating}/${max} Flames`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`flame-icon ${i < Math.round(rating) ? "active" : ""}`}>
          🔥
        </span>
      ))}
    </span>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: typeof POPULAR_ARTICLES[0] }) {
  return (
    <Link href={`/news/${article.id}`}>
      <div className="blrd-card flex gap-3 p-3 group">
        <div className="w-24 h-20 shrink-0 rounded overflow-hidden bg-gray-800">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`blrd-tag blrd-tag-${article.tag} mb-1`}>{article.label}</span>
          <h3
            className="text-sm font-semibold leading-tight mb-1 line-clamp-2 transition-colors group-hover:text-cyan-400"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
          >
            {article.title}
          </h3>
          <p className="text-xs line-clamp-1" style={{ color: "var(--blrd-gray)" }}>
            {article.subhead}
          </p>
          {article.comments !== undefined && (
            <span className="text-xs mt-1 block" style={{ color: "var(--blrd-gray)" }}>
              💬 {article.comments}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Latest Item ──────────────────────────────────────────────────────────
function LatestItem({ article }: { article: typeof LATEST_ARTICLES[0] }) {
  return (
    <Link href={`/news/${article.id}`}>
      <div
        className="py-3 border-b group cursor-pointer"
        style={{ borderColor: "var(--blrd-border)" }}
      >
        <div className="flex items-start gap-2 mb-1">
          <span className={`blrd-tag blrd-tag-${article.tag} shrink-0`}>{article.label}</span>
          <span className="text-xs ml-auto shrink-0" style={{ color: "var(--blrd-gray)" }}>
            {article.timeAgo}
          </span>
        </div>
        <h3
          className="text-sm font-semibold leading-snug transition-colors group-hover:text-cyan-400"
          style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
        >
          {article.title}
        </h3>
        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--blrd-gray)" }}>
          {article.subhead}
        </p>
      </div>
    </Link>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goPrev = () => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const goNext = () => goTo((current + 1) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[current];

  return (
    <div
      className="hero-slide relative w-full"
      style={{ height: "clamp(280px, 45vw, 480px)" }}
    >
      {/* Background Image */}
      <img
        src={slide.image}
        alt={slide.category}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: isTransitioning ? 0.5 : 1 }}
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.2) 75%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ zIndex: 2, padding: "0 clamp(16px, 4vw, 48px)" }}
      >
        <div className="max-w-lg">
          <span
            className={`blrd-tag blrd-tag-${slide.tag} mb-3 inline-block`}
            style={{ fontSize: "0.65rem" }}
          >
            {slide.category}
          </span>
          <h1
            className="font-display font-black leading-tight mb-3"
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
              color: "var(--blrd-white)",
              textShadow: `0 0 40px ${slide.accent}44`,
            }}
          >
            {slide.title}
          </h1>
          <p
            className="mb-4 leading-relaxed"
            style={{
              fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
              color: "var(--blrd-gray-light)",
              maxWidth: "420px",
            }}
          >
            {slide.subhead}
          </p>
          <Link href={slide.ctaHref}>
            <button
              className="px-5 py-2.5 rounded text-sm font-ui font-bold tracking-wider transition-all hover:brightness-110"
              style={{
                background: slide.accent,
                color: "var(--blrd-black)",
                letterSpacing: "0.1em",
              }}
            >
              {slide.cta} →
            </button>
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3" style={{ zIndex: 3 }}>
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className="transition-all rounded-full"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? slide.accent : "rgba(255,255,255,0.3)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.7)", color: "var(--blrd-white)", zIndex: 3 }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.7)", color: "var(--blrd-white)", zIndex: 3 }}
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide counter */}
      <div
        className="absolute top-4 right-4 text-xs font-display"
        style={{ color: "rgba(255,255,255,0.5)", zIndex: 3 }}
      >
        {String(current + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────
export default function Home() {
  return (
    <Layout showSidebar={false}>
      {/* Hero Carousel — full width, no container */}
      <HeroCarousel />

      {/* Main content with sidebar layout */}
      <div className="container py-6">
        <div className="flex gap-6">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Popular Now + Latest */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Popular Now */}
              <div>
                <div className="section-header">
                  <h2>Popular Now</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {POPULAR_ARTICLES.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>

              {/* Latest */}
              <div>
                <div className="section-header">
                  <h2>Latest</h2>
                </div>
                <div>
                  {LATEST_ARTICLES.map((a) => (
                    <LatestItem key={a.id} article={a} />
                  ))}
                </div>
                <Link href="/news">
                  <button
                    className="w-full mt-4 py-2.5 text-sm font-ui font-semibold rounded border transition-colors hover:border-cyan-500 hover:text-cyan-400"
                    style={{
                      borderColor: "var(--blrd-border)",
                      color: "var(--blrd-gray-light)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    See More Articles →
                  </button>
                </Link>
              </div>
            </div>

            {/* Category Sections */}
            {CATEGORY_SECTIONS.map((section) => (
              <div key={section.id} className="mb-8">
                <div className="section-header">
                  <span style={{ color: section.color }}>{section.icon}</span>
                  <h2 style={{ color: section.color }}>{section.label}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.articles.map((article, i) => (
                    <Link key={i} href={`/news?category=${section.id}`}>
                      <div
                        className="blrd-card p-3 group cursor-pointer"
                        style={{ borderLeft: `3px solid ${section.color}` }}
                      >
                        <span className={`blrd-tag blrd-tag-${article.tag} mb-2`}>
                          {section.label}
                        </span>
                        <h4
                          className="text-sm font-semibold leading-snug transition-colors group-hover:text-cyan-400"
                          style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
                        >
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href={`/news?category=${section.id}`}>
                  <span
                    className="text-xs mt-2 inline-block font-ui transition-colors hover:text-white"
                    style={{ color: section.color }}
                  >
                    More {section.label} →
                  </span>
                </Link>
              </div>
            ))}

            {/* Discover CTA Banner */}
            <div
              className="rounded p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(27,201,201,0.1) 0%, rgba(27,201,201,0.1) 100%)",
                border: "1px solid rgba(27,201,201,0.2)",
              }}
            >
              <div>
                <h3 className="font-display text-sm font-bold mb-1" style={{ color: "var(--blrd-cyan)" }}>
                  DISCOVER PREMIUM CONTENT
                </h3>
                <p className="text-sm" style={{ color: "var(--blrd-gray-light)" }}>
                  Explore curated articles, videos, and podcasts from creators and brands in the BLRD network.
                </p>
              </div>
              <Link href="/discover">
                <button
                  className="shrink-0 px-5 py-2.5 rounded text-sm font-ui font-bold tracking-wider transition-all hover:brightness-110"
                  style={{
                    background: "var(--blrd-cyan)",
                    color: "var(--blrd-black)",
                    letterSpacing: "0.1em",
                  }}
                >
                  Explore Discover →
                </button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:flex flex-col gap-4 w-[300px] shrink-0">
            {/* Ad */}
            <div className="ad-zone ad-sidebar">
              <span className="mt-6 text-xs opacity-50 text-center px-2">Your Ad Here<br />300×250</span>
            </div>

            {/* Trending Topics */}
            <div
              className="rounded p-4"
              style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
            >
              <h3 className="font-display text-xs font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {["#Gaming2025", "#AfroFuturism", "#IndieDev", "#BlackComics", "#GeekCulture", "#Cosplay", "#Streaming", "#Esports", "#ScienceFiction", "#CreatorEconomy"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded cursor-pointer transition-colors hover:text-white font-ui"
                    style={{
                      background: "var(--blrd-dark-3)",
                      color: "var(--blrd-gray-light)",
                      border: "1px solid var(--blrd-border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Reviews */}
            <div
              className="rounded p-4"
              style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
            >
              <h3 className="font-display text-xs font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-orange)" }}>
                Top Rated
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Elden Ring: Shadow of the Erdtree", rating: 5, category: "games" },
                  { title: "Andor Season 2", rating: 5, category: "tv" },
                  { title: "Absolute Batman #1", rating: 4, category: "comics" },
                ].map((item, i) => (
                  <Link key={i} href="/reviews">
                    <div className="group cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-xs font-semibold leading-snug group-hover:text-cyan-400 transition-colors"
                          style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
                        >
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FlameDisplay rating={item.rating} />
                        <span className={`blrd-tag blrd-tag-${item.category}`}>{item.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ad */}
            <div className="ad-zone ad-sidebar">
              <span className="mt-6 text-xs opacity-50 text-center px-2">Your Ad Here<br />300×250</span>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
