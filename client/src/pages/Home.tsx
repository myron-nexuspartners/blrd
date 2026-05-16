import { useState, useEffect } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  BookOpen,
  Tv,
  Music,
  Cpu,
  Zap,
  ArrowRight,
  Users,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// ─── Design Tokens (scoped to Home light theme) ─────────────────────────────
const T = {
  cream:    "#F8F5EF",
  navy:     "#0B1A2E",
  charcoal: "#1A1A1A",
  body:     "#2C2C2C",
  gold:     "#B8892A",
  goldMid:  "#C99A3E",
  goldLight:"#E8C878",
  muted:    "#555550",
  rule:     "#D8D3C8",
  soft:     "#EDE9E0",
  white:    "#FFFFFF",
} as const;

// ─── CDN Image URLs ──────────────────────────────────────────────────────────
const IMGS = {
  hero:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/hero-redesign-main-J9WYNWHkuHdRh4NB8bvaub.webp",
  gaming:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/section-gaming-redesign-7aRN5QkVpFbZpK6552Xpvt.webp",
  comics:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/section-comics-redesign-HUuiQ88mj7VB3K7vZ7XUNi.webp",
  creators: "https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/section-creators-redesign-iviNx73GH2dBFzJ8Jex3RL.webp",
} as const;

// ─── Vertical config ─────────────────────────────────────────────────────────
const VERTICALS = [
  { id: "gaming",               label: "Gaming",                icon: <Gamepad2 size={13} />, href: "/news?vertical=gaming" },
  { id: "tv-streaming",         label: "TV & Streaming",         icon: <Tv size={13} />,       href: "/news?vertical=tv-streaming" },
  { id: "music-movies",         label: "Music & Movies",         icon: <Music size={13} />,    href: "/news?vertical=music-movies" },
  { id: "comics-cosplay-anime", label: "Comics, Cosplay & Anime",icon: <BookOpen size={13} />, href: "/news?vertical=comics-cosplay-anime" },
  { id: "technology-culture",   label: "Technology & Culture",   icon: <Cpu size={13} />,      href: "/news?vertical=technology-culture" },
] as const;

// ─── Static placeholder content ──────────────────────────────────────────────
const POPULAR_ARTICLES = [
  {
    id: 1, tag: "Gaming", label: "Gaming",
    title: "The Rise of Indie Games Featuring Diverse Protagonists Is Reshaping the Industry",
    subhead: "How small studios are filling the representation gap that major publishers keep ignoring.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    author: "Kai Osei",
    timeAgo: "2h ago",
  },
  {
    id: 2, tag: "Comics", label: "Comics",
    title: "Miles Morales at 15: How One Character Changed What Superhero Stories Could Be",
    subhead: "A look back at the cultural impact of Marvel's Spider-Man and what comes next.",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    author: "Amara Diallo",
    timeAgo: "4h ago",
  },
  {
    id: 3, tag: "Movies", label: "Movies",
    title: "Afrofuturism in Film: The Genre That Refuses to Stay Niche",
    subhead: "From Black Panther to Nope — why these films matter beyond the box office.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    author: "Sol Rivera",
    timeAgo: "6h ago",
  },
];

const LATEST_ARTICLES = [
  { id: 7,  tag: "Gaming",  title: "Elden Ring's Shadow of the Erdtree DLC Gets a Surprise Sequel Announcement",  timeAgo: "2h ago" },
  { id: 8,  tag: "Comics",  title: "DC's New 'Absolute Universe' Reboot: Everything You Need to Know",             timeAgo: "4h ago" },
  { id: 9,  tag: "Movies",  title: "Jordan Peele's Next Project Is Officially in Production",                       timeAgo: "6h ago" },
  { id: 10, tag: "TV",      title: "Andor Season 2 Review: The Best Star Wars Content in Years",                    timeAgo: "8h ago" },
  { id: 11, tag: "Tech",    title: "Steam Deck 2 Specs Leaked: Here's What We Know",                               timeAgo: "10h ago" },
  { id: 12, tag: "Culture", title: "The Oral History of Black Cosplay: Community, Craft, and Visibility",          timeAgo: "12h ago" },
  { id: 13, tag: "Events",  title: "BlerdCon 2025 Announces Full Programming Schedule",                             timeAgo: "1d ago" },
  { id: 14, tag: "Creators",title: "How This Twitch Streamer Built a 100K Community Without Compromising Her Vision", timeAgo: "1d ago" },
];

const TOP_RATED = [
  { title: "Elden Ring: Shadow of the Erdtree", rating: 5, tag: "Games" },
  { title: "Andor Season 2",                    rating: 5, tag: "TV" },
  { title: "Absolute Batman #1",                rating: 4, tag: "Comics" },
];

const TRENDING_TAGS = [
  "#Gaming2025", "#AfroFuturism", "#IndieDev", "#BlackComics",
  "#GeekCulture", "#Cosplay", "#Streaming", "#Esports",
  "#ScienceFiction", "#CreatorEconomy",
];

// ─── Shared font helpers ─────────────────────────────────────────────────────
const serif = "'Playfair Display', Georgia, serif";
const sans  = "'Jost', 'Inter', sans-serif";

// ─── Category Tag (light theme) ──────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: sans,
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: "2px",
        background: `${T.gold}18`,
        color: T.gold,
        border: `1px solid ${T.gold}44`,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── Flame Rating Display ─────────────────────────────────────────────────────
function FlameDisplay({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span title={`${rating}/${max} Flames`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: "0.9rem",
            filter: i < Math.round(rating) ? "none" : "grayscale(1) opacity(0.2)",
          }}
        >
          🔥
        </span>
      ))}
    </span>
  );
}

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionLabel({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <span
        style={{
          fontFamily: sans,
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: gold ? T.gold : T.charcoal,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${T.rule}, transparent)` }} />
    </div>
  );
}

// ─── Featured Article Card (large, with image) ───────────────────────────────
function FeaturedCard({ article }: { article: typeof POPULAR_ARTICLES[0] }) {
  return (
    <Link href={`/news/${article.id}`}>
      <div
        className="group"
        style={{
          background: T.white,
          border: `1px solid ${T.rule}`,
          borderRadius: "4px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease, transform 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 28px rgba(11,26,46,0.12)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        <div style={{ height: "180px", overflow: "hidden" }}>
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            className="group-hover:scale-105"
          />
        </div>
        <div style={{ padding: "16px" }}>
          <Tag label={article.label} />
          <h3
            style={{
              fontFamily: serif,
              fontSize: "1rem",
              fontWeight: 700,
              color: T.charcoal,
              lineHeight: 1.35,
              marginTop: "8px",
              marginBottom: "6px",
            }}
          >
            {article.title}
          </h3>
          <p style={{ fontFamily: sans, fontSize: "0.8rem", color: T.muted, lineHeight: 1.5 }}>
            {article.subhead}
          </p>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: sans,
              fontSize: "0.7rem",
              color: T.muted,
            }}
          >
            <span style={{ fontWeight: 600, color: T.gold }}>{article.author}</span>
            <span>·</span>
            <span>{article.timeAgo}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Latest Item (compact list row) ──────────────────────────────────────────
function LatestItem({ article }: { article: typeof LATEST_ARTICLES[0] }) {
  return (
    <Link href={`/news/${article.id}`}>
      <div
        style={{
          padding: "12px 0",
          borderBottom: `1px solid ${T.rule}`,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          const h = (e.currentTarget as HTMLDivElement).querySelector("h4") as HTMLElement | null;
          if (h) h.style.color = T.gold;
        }}
        onMouseLeave={(e) => {
          const h = (e.currentTarget as HTMLDivElement).querySelector("h4") as HTMLElement | null;
          if (h) h.style.color = T.charcoal;
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Tag label={article.tag} />
          <span style={{ fontFamily: sans, fontSize: "0.65rem", color: T.muted, marginLeft: "auto" }}>
            {article.timeAgo}
          </span>
        </div>
        <h4
          style={{
            fontFamily: serif,
            fontSize: "0.88rem",
            fontWeight: 600,
            color: T.charcoal,
            lineHeight: 1.35,
            transition: "color 0.15s ease",
          }}
        >
          {article.title}
        </h4>
      </div>
    </Link>
  );
}

// ─── Latest by Vertical (live data) ──────────────────────────────────────────
function LatestByVertical() {
  const { data, isLoading } = trpc.articles.latestByVertical.useQuery();

  return (
    <div style={{ marginBottom: "48px" }}>
      <SectionLabel gold>Latest by Vertical</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {VERTICALS.map((v, i) => {
          const article = isLoading ? null : (data?.[i] ?? null);

          return (
            <Link key={v.id} href={article ? `/news/${(article as { slug?: string }).slug ?? ""}` : v.href}>
              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.rule}`,
                  borderTop: `3px solid ${T.gold}`,
                  borderRadius: "4px",
                  padding: "16px",
                  cursor: "pointer",
                  minHeight: "140px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.2s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(11,26,46,0.1)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span style={{ color: T.gold }}>{v.icon}</span>
                    <span
                      style={{
                        fontFamily: sans,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: T.gold,
                      }}
                    >
                      {v.label}
                    </span>
                  </div>

                  {isLoading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ height: "10px", borderRadius: "2px", background: T.rule, width: "90%" }} />
                      <div style={{ height: "10px", borderRadius: "2px", background: T.rule, width: "70%" }} />
                    </div>
                  ) : article ? (
                    <h4
                      style={{
                        fontFamily: serif,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: T.charcoal,
                        lineHeight: 1.35,
                      }}
                    >
                      {(article as { title: string }).title}
                    </h4>
                  ) : (
                    <p style={{ fontFamily: sans, fontSize: "0.75rem", color: T.muted, fontStyle: "italic" }}>
                      No articles yet. Check back soon.
                    </p>
                  )}
                </div>

                <span
                  style={{
                    fontFamily: sans,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: T.gold,
                    marginTop: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {article ? "Read More" : `Explore ${v.label}`} <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function EditorialHero() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(320px, 50vw, 540px)",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <img
        src={IMGS.hero}
        alt="BLRD — Diverse geek culture community"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
        }}
      />

      {/* Gradient overlay — left-heavy for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(11,26,46,0.92) 0%, rgba(11,26,46,0.72) 40%, rgba(11,26,46,0.3) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(20px, 5vw, 64px)",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "520px" }}>
          <span
            style={{
              fontFamily: sans,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.goldLight,
              display: "block",
              marginBottom: "12px",
            }}
          >
            Blerd Vision Entertainment
          </span>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              color: T.white,
              lineHeight: 1.15,
              marginBottom: "16px",
              letterSpacing: "-0.01em",
            }}
          >
            Where Geek Culture Finds Its Authentic Voice
          </h1>
          <p
            style={{
              fontFamily: sans,
              fontSize: "clamp(0.85rem, 1.6vw, 1rem)",
              color: "rgba(248,245,239,0.85)",
              lineHeight: 1.65,
              marginBottom: "24px",
              maxWidth: "400px",
            }}
          >
            Gaming, comics, film, TV, and creators — covered by and for the community that actually lives this culture.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/news">
              <button
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "12px 24px",
                  borderRadius: "3px",
                  background: T.gold,
                  color: T.white,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.goldMid)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.gold)}
              >
                Explore News <ArrowRight size={14} />
              </button>
            </Link>
            <Link href="/discover">
              <button
                style={{
                  fontFamily: sans,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "12px 24px",
                  borderRadius: "3px",
                  background: "transparent",
                  color: T.white,
                  border: `1px solid rgba(248,245,239,0.4)`,
                  cursor: "pointer",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = T.goldLight;
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,137,42,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,245,239,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                Discover More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual Feature Strip (3-column image grid) ───────────────────────────────
function FeatureStrip() {
  const items = [
    {
      img: IMGS.gaming,
      label: "Gaming",
      headline: "Level Up Your Game Culture",
      href: "/news?vertical=gaming",
    },
    {
      img: IMGS.comics,
      label: "Comics & Anime",
      headline: "Every Panel Tells a Story",
      href: "/news?vertical=comics-cosplay-anime",
    },
    {
      img: IMGS.creators,
      label: "Creators",
      headline: "Built by Creators, for Creators",
      href: "/discover",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "2px",
        marginBottom: "48px",
      }}
    >
      {items.map((item) => (
        <Link key={item.label} href={item.href}>
          <div
            style={{
              position: "relative",
              height: "220px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const img = (e.currentTarget as HTMLDivElement).querySelector("img") as HTMLImageElement | null;
              if (img) img.style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              const img = (e.currentTarget as HTMLDivElement).querySelector("img") as HTMLImageElement | null;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              src={item.img}
              alt={item.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
            />
            {/* Dark gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(11,26,46,0.85) 0%, rgba(11,26,46,0.2) 60%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: sans,
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: T.goldLight,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {item.label}
              </span>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: T.white,
                  lineHeight: 1.25,
                }}
              >
                {item.headline}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Ad Zone (light theme) ────────────────────────────────────────────────────
function AdZone({ width, height, label }: { width: string; height: string; label: string }) {
  return (
    <div
      style={{
        width,
        height,
        background: T.soft,
        border: `1px dashed ${T.rule}`,
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "6px",
          left: "10px",
          fontFamily: sans,
          fontSize: "0.45rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.muted,
          opacity: 0.6,
        }}
      >
        Advertisement
      </span>
      <span style={{ fontFamily: sans, fontSize: "0.7rem", color: T.muted }}>{label}</span>
    </div>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  return (
    <Layout showSidebar={false}>
      {/* ── Light-theme wrapper — scoped to Home only ── */}
      <div
        style={{
          background: T.cream,
          color: T.body,
          fontFamily: sans,
        }}
      >
        {/* Top Ad Banner */}
        <div style={{ background: T.soft, borderBottom: `1px solid ${T.rule}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
            <AdZone width="100%" height="80px" label="Your Ad Here · 728×90" />
          </div>
        </div>

        {/* Hero */}
        <EditorialHero />

        {/* Feature Strip */}
        <FeatureStrip />

        {/* Main content area */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem 64px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "40px",
            }}
            id="home-content-grid"
          >
            {/* ── Main Column ── */}
            <div>
              {/* Popular + Latest grid */}
              <div
                style={{ display: "grid", gap: "40px", marginBottom: "48px", gridTemplateColumns: "1fr" }}
                id="popular-latest-grid"
              >
                {/* Popular Now */}
                <div>
                  <SectionLabel>Popular Now</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {POPULAR_ARTICLES.map((a) => (
                      <FeaturedCard key={a.id} article={a} />
                    ))}
                  </div>
                </div>

                {/* Latest */}
                <div>
                  <SectionLabel>Latest</SectionLabel>
                  <div>
                    {LATEST_ARTICLES.map((a) => (
                      <LatestItem key={a.id} article={a} />
                    ))}
                  </div>
                  <Link href="/news">
                    <button
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "10px",
                        fontFamily: sans,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: T.gold,
                        background: "transparent",
                        border: `1px solid ${T.gold}55`,
                        borderRadius: "3px",
                        cursor: "pointer",
                        transition: "background 0.15s ease, border-color 0.15s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = `${T.gold}12`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = T.gold;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = `${T.gold}55`;
                      }}
                    >
                      See All Articles <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Latest by Vertical — live DB data */}
              <LatestByVertical />

              {/* Discover CTA Banner */}
              <div
                style={{
                  background: T.navy,
                  borderRadius: "6px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "48px",
                }}
                id="discover-cta-inner"
              >
                <div>
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: T.goldLight,
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Premium Content
                  </span>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: T.white,
                      lineHeight: 1.25,
                      marginBottom: "8px",
                    }}
                  >
                    Discover the BLRD Network
                  </h3>
                  <p
                    style={{
                      fontFamily: sans,
                      fontSize: "0.85rem",
                      color: "rgba(248,245,239,0.75)",
                      lineHeight: 1.6,
                      maxWidth: "380px",
                    }}
                  >
                    Curated articles, videos, and podcasts from creators and brands in the BLRD ecosystem.
                  </p>
                </div>
                <Link href="/discover">
                  <button
                    style={{
                      fontFamily: sans,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "12px 28px",
                      borderRadius: "3px",
                      background: T.gold,
                      color: T.white,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.goldMid)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.gold)}
                  >
                    Explore Discover <ArrowRight size={14} />
                  </button>
                </Link>
              </div>

              {/* Bottom Ad Banner */}
              <AdZone width="100%" height="90px" label="Your Ad Here · 728×90" />
            </div>

            {/* ── Sidebar ── */}
            <aside
              style={{ display: "none" }}
              id="home-sidebar"
            >
              {/* Ad */}
              <AdZone width="100%" height="250px" label="300×250" />

              {/* Trending Topics */}
              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.rule}`,
                  borderRadius: "4px",
                  padding: "20px",
                }}
              >
                <SectionLabel gold>Trending Topics</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TRENDING_TAGS.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: sans,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: "2px",
                        background: T.soft,
                        color: T.body,
                        border: `1px solid ${T.rule}`,
                        cursor: "pointer",
                        transition: "background 0.15s ease, color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.background = `${T.gold}18`;
                        (e.currentTarget as HTMLSpanElement).style.color = T.gold;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.background = T.soft;
                        (e.currentTarget as HTMLSpanElement).style.color = T.body;
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Rated */}
              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.rule}`,
                  borderRadius: "4px",
                  padding: "20px",
                }}
              >
                <SectionLabel gold>Top Rated</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {TOP_RATED.map((item, i) => (
                    <Link key={i} href="/reviews">
                      <div
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => {
                          const h = (e.currentTarget as HTMLDivElement).querySelector("span.title") as HTMLElement | null;
                          if (h) h.style.color = T.gold;
                        }}
                        onMouseLeave={(e) => {
                          const h = (e.currentTarget as HTMLDivElement).querySelector("span.title") as HTMLElement | null;
                          if (h) h.style.color = T.charcoal;
                        }}
                      >
                        <span
                          className="title"
                          style={{
                            fontFamily: serif,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: T.charcoal,
                            display: "block",
                            marginBottom: "4px",
                            lineHeight: 1.3,
                            transition: "color 0.15s ease",
                          }}
                        >
                          {item.title}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FlameDisplay rating={item.rating} />
                          <Tag label={item.tag} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Authors CTA */}
              <div
                style={{
                  background: T.navy,
                  borderRadius: "4px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <Users size={24} style={{ color: T.goldLight, margin: "0 auto 10px" }} />
                <h4
                  style={{
                    fontFamily: serif,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: T.white,
                    marginBottom: "6px",
                  }}
                >
                  Meet Our Writers
                </h4>
                <p
                  style={{
                    fontFamily: sans,
                    fontSize: "0.75rem",
                    color: "rgba(248,245,239,0.7)",
                    marginBottom: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  5 beat writers covering every corner of geek culture.
                </p>
                <Link href="/authors">
                  <button
                    style={{
                      fontFamily: sans,
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "8px 18px",
                      borderRadius: "3px",
                      background: "transparent",
                      color: T.goldLight,
                      border: `1px solid ${T.goldLight}55`,
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = `${T.gold}22`)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                  >
                    View Authors
                  </button>
                </Link>
              </div>

              {/* Ad */}
              <AdZone width="100%" height="250px" label="300×250" />
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
