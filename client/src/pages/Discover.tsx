import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Play, Headphones, FileText, ExternalLink, Star } from "lucide-react";

const MARQUEE_ITEMS = [
  {
    id: 1, type: "video", sponsor: "Xbox Game Studios",
    title: "Exclusive: Fable Gameplay Deep Dive — 30 Minutes of Never-Before-Seen Footage",
    tag: "gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
    cta: "Watch Now",
  },
  {
    id: 2, type: "article", sponsor: "Marvel Entertainment",
    title: "The Complete Guide to Marvel's Summer 2025 Event: Blood Hunt Aftermath",
    tag: "comics", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80",
    cta: "Read More",
  },
  {
    id: 3, type: "podcast", sponsor: "Sony Pictures",
    title: "Spider-Man: Beyond the Spider-Verse — Director's Commentary Podcast Series",
    tag: "film", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    cta: "Listen Now",
  },
  {
    id: 4, type: "video", sponsor: "Nintendo of America",
    title: "Nintendo Direct Summer 2025: Every Announcement Ranked and Analyzed",
    tag: "gaming", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    cta: "Watch Now",
  },
  {
    id: 5, type: "article", sponsor: "Dark Horse Comics",
    title: "Creator Spotlight: The Visionary Artists Reshaping Sci-Fi Comics in 2025",
    tag: "comics", image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&q=80",
    cta: "Read More",
  },
  {
    id: 6, type: "podcast", sponsor: "HBO Max",
    title: "The Last of Us Season 3 Writers Room: An Exclusive Podcast Interview",
    tag: "tv", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&q=80",
    cta: "Listen Now",
  },
];

const DISCOVER_CONTENT = [
  {
    id: 1, type: "video", sponsor: "Riot Games",
    title: "League of Legends: The Arcane Season 2 Visual Effects Breakdown",
    subhead: "A behind-the-scenes look at how Fortiche Productions created the most visually stunning animated series in gaming history.",
    tag: "gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    cta: "Watch Now", ctaHref: "#",
  },
  {
    id: 2, type: "article", sponsor: "DC Comics",
    title: "Absolute Universe: The Complete Reading Order for New and Returning Fans",
    subhead: "DC's boldest creative relaunch explained — everything you need to know before picking up your first issue.",
    tag: "comics", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    cta: "Read the Guide", ctaHref: "#",
  },
  {
    id: 3, type: "podcast", sponsor: "A24 Films",
    title: "The Craft of Afrofuturism: A Conversation with Emerging Filmmakers",
    subhead: "Six directors discuss how they're using science fiction to explore identity, community, and possibility in their debut features.",
    tag: "film", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    cta: "Listen Now", ctaHref: "#",
  },
  {
    id: 4, type: "article", sponsor: "Steam",
    title: "The 25 Best Indie Games of 2025: Curated by the BLRD Community",
    subhead: "From narrative adventures to roguelikes — the games you need to play that didn't get enough mainstream coverage.",
    tag: "gaming", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    cta: "See the List", ctaHref: "#",
  },
  {
    id: 5, type: "video", sponsor: "Netflix",
    title: "Arcane Season 2: The Character Arcs That Defined a Generation of Animation",
    subhead: "A deep dive into the storytelling choices that made Arcane the most talked-about animated series of the decade.",
    tag: "tv", image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=600&q=80",
    cta: "Watch Now", ctaHref: "#",
  },
  {
    id: 6, type: "podcast", sponsor: "Image Comics",
    title: "The Business of Independent Comics: Creator-Owned Publishing in 2025",
    subhead: "Veteran creators share what it really takes to launch and sustain an independent comic series in today's market.",
    tag: "comics", image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=600&q=80",
    cta: "Listen Now", ctaHref: "#",
  },
  {
    id: 7, type: "article", sponsor: "Bandai Namco",
    title: "Tekken 8 Season 3: The Complete Character Tier List and Patch Analysis",
    subhead: "Our competitive analysts break down every change in the latest update and what it means for the meta.",
    tag: "gaming", image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80",
    cta: "Read Analysis", ctaHref: "#",
  },
  {
    id: 8, type: "video", sponsor: "Jordan Peele / Monkeypaw",
    title: "Jordan Peele's New Project: First Look at the Concept Art and Story Teaser",
    subhead: "The acclaimed filmmaker gives BLRD an exclusive first look at his most ambitious project yet.",
    tag: "film", image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    cta: "Watch Teaser", ctaHref: "#",
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <Play size={12} />,
  article: <FileText size={12} />,
  podcast: <Headphones size={12} />,
};

const TYPE_COLORS: Record<string, string> = {
  video: "var(--blrd-cyan)",
  article: "#b388ff",
  podcast: "var(--blrd-amber)",
};

const CONTENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "video", label: "Videos" },
  { id: "article", label: "Articles" },
  { id: "podcast", label: "Podcasts" },
];

const CATEGORY_FILTERS = [
  { id: "all", label: "All Categories" },
  { id: "gaming", label: "Gaming" },
  { id: "comics", label: "Comics" },
  { id: "film", label: "Movies" },
  { id: "tv", label: "TV" },
];

export default function Discover() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = DISCOVER_CONTENT.filter((item) => {
    const typeMatch = typeFilter === "all" || item.type === typeFilter;
    const catMatch = catFilter === "all" || item.tag === catFilter;
    return typeMatch && catMatch;
  });

  return (
    <Layout showSidebar={false}>
      {/* Hero Header */}
      <div
        className="relative py-12 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(26,111,255,0.12) 0%, rgba(8,10,15,1) 50%, rgba(0,212,255,0.08) 100%)",
          borderBottom: "1px solid var(--blrd-border)",
        }}
      >
        <div className="container">
          <span className="blrd-tag blrd-tag-creators mb-3 inline-block">Premium Content</span>
          <h1
            className="font-display font-black mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--blrd-white)" }}
          >
            Discover
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--blrd-gray-light)" }}>
            Premium sponsored content from brands, publishers, and creators in the BLRD network. Curated articles, videos, and podcasts — all in one place.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="py-4 overflow-hidden"
        style={{ background: "var(--blrd-dark-2)", borderBottom: "1px solid var(--blrd-border)" }}
      >
        <div className="flex items-center gap-3 mb-2 container">
          <span
            className="text-xs font-display font-bold tracking-widest uppercase shrink-0"
            style={{ color: "var(--blrd-cyan)" }}
          >
            ★ Featured
          </span>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center gap-3 mx-4 shrink-0 group"
                style={{ width: "320px" }}
              >
                <div className="w-16 h-12 rounded overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-xs font-ui flex items-center gap-1"
                      style={{ color: TYPE_COLORS[item.type] }}
                    >
                      {TYPE_ICONS[item.type]}
                      {item.type}
                    </span>
                    <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
                      · {item.sponsor}
                    </span>
                  </div>
                  <p
                    className="text-xs font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-cyan-400"
                    style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
                  >
                    {item.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {CONTENT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className="px-3 py-1.5 text-xs rounded border transition-all font-ui font-semibold"
                style={{
                  background: typeFilter === f.id ? "var(--blrd-cyan)" : "var(--blrd-dark-2)",
                  borderColor: typeFilter === f.id ? "var(--blrd-cyan)" : "var(--blrd-border)",
                  color: typeFilter === f.id ? "var(--blrd-black)" : "var(--blrd-gray-light)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setCatFilter(f.id)}
                className="px-3 py-1.5 text-xs rounded border transition-all font-ui font-semibold"
                style={{
                  background: catFilter === f.id ? "rgba(0,212,255,0.15)" : "transparent",
                  borderColor: catFilter === f.id ? "var(--blrd-cyan)" : "var(--blrd-border)",
                  color: catFilter === f.id ? "var(--blrd-cyan)" : "var(--blrd-gray-light)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sponsored Label */}
        <div className="section-header">
          <h2>Sponsored Content</h2>
          <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
            {filtered.length} items
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="blrd-card group overflow-hidden flex flex-col">
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Type badge */}
                <div
                  className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded text-xs font-ui font-semibold"
                  style={{
                    background: "rgba(8,10,15,0.85)",
                    color: TYPE_COLORS[item.type],
                    border: `1px solid ${TYPE_COLORS[item.type]}44`,
                  }}
                >
                  {TYPE_ICONS[item.type]}
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
                {/* Sponsored badge */}
                <div
                  className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-ui"
                  style={{ background: "rgba(8,10,15,0.85)", color: "var(--blrd-amber)" }}
                >
                  ★ Sponsored
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`blrd-tag blrd-tag-${item.tag}`}>{item.tag}</span>
                  <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
                    {item.sponsor}
                  </span>
                </div>
                <h3
                  className="text-sm font-semibold leading-snug mb-2 flex-1 transition-colors group-hover:text-cyan-400"
                  style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--blrd-gray)" }}>
                  {item.subhead}
                </p>
                <a
                  href={item.ctaHref}
                  className="flex items-center justify-center gap-2 py-2 rounded text-xs font-ui font-bold tracking-wider transition-all hover:brightness-110"
                  style={{
                    background: TYPE_COLORS[item.type],
                    color: "var(--blrd-black)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {item.cta}
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Advertise CTA */}
        <div
          className="mt-10 rounded p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,179,0,0.08) 0%, rgba(255,107,0,0.05) 100%)",
            border: "1px solid rgba(255,179,0,0.2)",
          }}
        >
          <h2 className="font-display font-bold mb-3" style={{ color: "var(--blrd-amber)", fontSize: "1.1rem" }}>
            Feature Your Brand on BLRD Discover
          </h2>
          <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: "var(--blrd-gray-light)" }}>
            Connect your brand, product, or content with our passionate community of geek culture enthusiasts. Premium placement in the Discover section reaches engaged, targeted audiences.
          </p>
          <Link href="/contact">
            <button
              className="px-6 py-3 rounded font-ui font-bold tracking-wider text-sm transition-all hover:brightness-110"
              style={{ background: "var(--blrd-amber)", color: "var(--blrd-black)", letterSpacing: "0.1em" }}
            >
              Advertise with BLRD →
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
