import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpDown, MapPin, ExternalLink, Calendar, Tag,
  Monitor, ChevronUp, ChevronDown, LayoutGrid, Table2,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ─── Static event data ────────────────────────────────────────────────────────
const EVENTS_DATA = [
  {
    id: 1,
    name: "BlerdCon 2025",
    description:
      "The DMV's premier convention celebrating Black geek culture. Three days of panels, gaming tournaments, cosplay competitions, artist alley, and community building. Featuring special guests from gaming, comics, film, and television.",
    type: "convention",
    category: "multi",
    location: "Washington, D.C.",
    isVirtual: false,
    startDate: new Date("2025-07-18"),
    endDate: new Date("2025-07-20"),
    registrationUrl: "https://blerdcon.com",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    price: "From $45",
  },
  {
    id: 2,
    name: "EVO 2025 — Fighting Game World Championship",
    description:
      "The world's largest and longest-running fighting game tournament. Featuring Tekken 8, Street Fighter 6, Mortal Kombat 1, and more. Watch the best players in the world compete for the championship.",
    type: "tournament",
    category: "gaming",
    location: "Las Vegas, NV",
    isVirtual: false,
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-03"),
    registrationUrl: "https://evo.gg",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    price: "Free to watch / $150 to compete",
  },
  {
    id: 3,
    name: "San Diego Comic-Con 2025",
    description:
      "The world's largest comics and pop culture convention. Four days of panels, exclusives, celebrity appearances, and the most anticipated announcements in entertainment.",
    type: "convention",
    category: "comics",
    location: "San Diego, CA",
    isVirtual: false,
    startDate: new Date("2025-07-24"),
    endDate: new Date("2025-07-27"),
    registrationUrl: "https://comic-con.org",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    price: "From $65",
  },
  {
    id: 4,
    name: "Afrofuturism Film Festival — Virtual Edition",
    description:
      "A curated virtual film festival celebrating Afrofuturist cinema from around the world. Featuring feature films, short films, and panel discussions with filmmakers.",
    type: "screening",
    category: "film",
    location: "Online",
    isVirtual: true,
    startDate: new Date("2025-09-12"),
    endDate: new Date("2025-09-14"),
    registrationUrl: "https://afrofuturismfest.com",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    price: "Free",
  },
  {
    id: 5,
    name: "PAX West 2025",
    description:
      "One of the largest gaming festivals in the world. Four days of game demos, panels, tournaments, and community events in Seattle.",
    type: "convention",
    category: "gaming",
    location: "Seattle, WA",
    isVirtual: false,
    startDate: new Date("2025-08-29"),
    endDate: new Date("2025-09-01"),
    registrationUrl: "https://west.paxsite.com",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    price: "From $55",
  },
  {
    id: 6,
    name: "Black Panther: Wakanda Forever Watch Party",
    description:
      "Community watch party celebrating the legacy of Black Panther. Featuring pre-show discussion, live commentary, and post-film panel with local creators.",
    type: "watch-party",
    category: "film",
    location: "Kansas City, MO",
    isVirtual: false,
    startDate: new Date("2025-06-28"),
    endDate: new Date("2025-06-28"),
    registrationUrl: "https://eventbrite.com",
    image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    price: "Free",
  },
  {
    id: 7,
    name: "Game Dev Workshop: Diverse Narratives in Games",
    description:
      "A hands-on workshop for aspiring game developers focused on creating authentic, culturally resonant narratives. Featuring industry professionals as mentors.",
    type: "workshop",
    category: "gaming",
    location: "Online",
    isVirtual: true,
    startDate: new Date("2025-07-05"),
    endDate: new Date("2025-07-05"),
    registrationUrl: "https://eventbrite.com",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    price: "$25",
  },
  {
    id: 8,
    name: "New York Comic Con 2025",
    description:
      "One of the largest pop culture events in North America. Comics, gaming, anime, film, TV, and more — all under one roof in New York City.",
    type: "convention",
    category: "multi",
    location: "New York, NY",
    isVirtual: false,
    startDate: new Date("2025-10-09"),
    endDate: new Date("2025-10-12"),
    registrationUrl: "https://newyorkcomiccon.com",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&q=80",
    price: "From $50",
  },
  {
    id: 9,
    name: "Twitch Rivals: Indie Showcase 2025",
    description:
      "A live streaming tournament showcasing the best indie games of 2025. Watch top streamers compete and discover your next favorite game.",
    type: "virtual",
    category: "gaming",
    location: "Online (Twitch)",
    isVirtual: true,
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-08-15"),
    registrationUrl: "https://twitch.tv/rivals",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    price: "Free",
  },
  {
    id: 10,
    name: "Anime Expo 2025",
    description:
      "North America's largest anime convention. Featuring industry panels, voice actor appearances, cosplay, and exclusive merchandise.",
    type: "convention",
    category: "culture",
    location: "Los Angeles, CA",
    isVirtual: false,
    startDate: new Date("2025-07-03"),
    endDate: new Date("2025-07-06"),
    registrationUrl: "https://anime-expo.org",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    price: "From $65",
  },
];

// ─── Label maps ───────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  convention: "Convention",
  tournament: "Tournament",
  panel: "Panel",
  screening: "Screening",
  workshop: "Workshop",
  "watch-party": "Watch Party",
  virtual: "Virtual",
  other: "Other",
};

const CAT_LABELS: Record<string, string> = {
  gaming: "Gaming",
  comics: "Comics",
  film: "Film",
  tv: "TV",
  tech: "Tech",
  culture: "Culture",
  multi: "Multi",
};

type SortKey = "name" | "startDate" | "type" | "category" | "location";
type SortDir = "asc" | "desc";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Filter pill button ───────────────────────────────────────────────────────
function FilterPill({
  active,
  onClick,
  children,
  accent = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs rounded border transition-all font-ui font-semibold whitespace-nowrap"
      style={{
        background: active
          ? accent
            ? "rgba(27,201,201,0.18)"
            : "var(--blrd-cyan)"
          : "var(--blrd-dark-2)",
        borderColor: active ? "var(--blrd-cyan)" : "var(--blrd-border)",
        color: active
          ? accent
            ? "var(--blrd-cyan)"
            : "var(--blrd-black)"
          : "var(--blrd-gray-light)",
      }}
    >
      {children}
    </button>
  );
}

// ─── Event detail modal ───────────────────────────────────────────────────────
function EventModal({
  event,
  onClose,
}: {
  event: (typeof EVENTS_DATA)[0];
  onClose: () => void;
}) {
  const trackClick = trpc.events.trackClick.useMutation();

  const handleRegister = () => {
    trackClick.mutate({ eventId: event.id });
    window.open(event.registrationUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded overflow-hidden"
        style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
      >
        {/* Hero image */}
        <div className="relative h-48">
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "rgba(0,0,0,0.7)", color: "var(--blrd-white)" }}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-4 flex gap-2">
            <span className={`blrd-tag blrd-tag-${event.category}`}>{CAT_LABELS[event.category]}</span>
            <span
              className="blrd-tag"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "var(--blrd-white)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {TYPE_LABELS[event.type]}
            </span>
            {event.isVirtual && <span className="blrd-tag blrd-tag-tech">Virtual</span>}
          </div>
        </div>

        <div className="p-5">
          <h2 className="font-display font-bold text-lg mb-2" style={{ color: "var(--blrd-white)" }}>
            {event.name}
          </h2>

          <div className="flex flex-wrap gap-4 mb-4 text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(event.startDate)}
              {event.endDate &&
                event.endDate.toDateString() !== event.startDate.toDateString() && (
                  <> — {formatDate(event.endDate)}</>
                )}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={12} />
              {event.price}
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--blrd-gray-light)" }}>
            {event.description}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleRegister}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110"
              style={{
                background: "var(--blrd-cyan)",
                color: "var(--blrd-black)",
                letterSpacing: "0.08em",
              }}
            >
              Register / Get Tickets
              <ExternalLink size={13} />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded border font-ui font-semibold text-sm transition-colors hover:border-cyan-500"
              style={{ borderColor: "var(--blrd-border)", color: "var(--blrd-gray-light)" }}
            >
              Close
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "var(--blrd-gray)" }}>
            You'll be redirected to the official event registration page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Right-rail ad sidebar ────────────────────────────────────────────────────
function EventsRightRail() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[300px] shrink-0">
      {/* Primary 300×250 ad */}
      <div
        className="ad-zone flex items-center justify-center rounded"
        style={{
          width: 300,
          height: 250,
          background: "var(--blrd-dark-2)",
          border: "1px dashed var(--blrd-border)",
        }}
      >
        <div className="text-center">
          <div className="text-xs font-ui uppercase tracking-widest mb-1" style={{ color: "var(--blrd-gray)" }}>
            Advertisement
          </div>
          <div className="text-xs" style={{ color: "var(--blrd-border)" }}>
            300 × 250
          </div>
        </div>
      </div>

      {/* Sticky second 300×250 ad */}
      <div
        className="ad-zone flex items-center justify-center rounded sticky top-24"
        style={{
          width: 300,
          height: 250,
          background: "var(--blrd-dark-2)",
          border: "1px dashed var(--blrd-border)",
        }}
      >
        <div className="text-center">
          <div className="text-xs font-ui uppercase tracking-widest mb-1" style={{ color: "var(--blrd-gray)" }}>
            Advertisement
          </div>
          <div className="text-xs" style={{ color: "var(--blrd-border)" }}>
            300 × 250
          </div>
        </div>
      </div>

      {/* Community CTA card */}
      <div
        className="rounded p-4"
        style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
      >
        <h4 className="font-display font-bold text-sm mb-1" style={{ color: "var(--blrd-white)" }}>
          Know of an Event?
        </h4>
        <p className="text-xs mb-3" style={{ color: "var(--blrd-gray)" }}>
          Help us keep the community informed. Submit an event for consideration.
        </p>
        <a
          href="/contact"
          className="block text-center py-2 rounded font-ui font-bold text-xs tracking-wider transition-all hover:brightness-110"
          style={{
            background: "var(--blrd-cyan)",
            color: "var(--blrd-black)",
            letterSpacing: "0.08em",
          }}
        >
          Submit an Event →
        </a>
      </div>
    </aside>
  );
}

// ─── Main Events page ─────────────────────────────────────────────────────────
export default function Events() {
  const [, navigate] = useLocation();
  const [sortKey, setSortKey] = useState<SortKey>("startDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<(typeof EVENTS_DATA)[0] | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Derive unique filter values from data
  const uniqueTypes = useMemo(
    () => Array.from(new Set(EVENTS_DATA.map((e) => e.type))).sort(),
    []
  );
  const uniqueCats = useMemo(
    () => Array.from(new Set(EVENTS_DATA.map((e) => e.category))).sort(),
    []
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Apply BOTH filters then sort
  const filtered = useMemo(() => {
    return [...EVENTS_DATA]
      .filter(
        (e) =>
          (catFilter === "all" || e.category === catFilter) &&
          (typeFilter === "all" || e.type === typeFilter)
      )
      .sort((a, b) => {
        let valA: string | number = a[sortKey] instanceof Date
          ? (a[sortKey] as Date).getTime()
          : String(a[sortKey]).toLowerCase();
        let valB: string | number = b[sortKey] instanceof Date
          ? (b[sortKey] as Date).getTime()
          : String(b[sortKey]).toLowerCase();
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [catFilter, typeFilter, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ArrowUpDown size={12} style={{ opacity: 0.4 }} />
    );

  return (
    <Layout showSidebar={false}>
      {/* ── Page header ── */}
      <div
        className="py-10 border-b"
        style={{
          borderColor: "var(--blrd-border)",
          background:
            "linear-gradient(135deg, rgba(27,201,201,0.07) 0%, rgba(0,0,0,1) 60%)",
        }}
      >
        <div className="container">
          <span className="blrd-tag blrd-tag-events mb-3 inline-block">Events</span>
          <h1
            className="font-display font-black mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--blrd-white)" }}
          >
            Upcoming Events
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--blrd-gray-light)" }}>
            Conventions, tournaments, screenings, and community events across gaming, comics, film, and culture.
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* ── Filter bar ── */}
        <div
          className="rounded p-4 mb-6"
          style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
        >
          {/* Row 1: Category filters */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-xs font-ui uppercase tracking-widest shrink-0 w-20"
              style={{ color: "var(--blrd-gray)" }}
            >
              Category
            </span>
            <FilterPill active={catFilter === "all"} onClick={() => setCatFilter("all")} accent>
              All Categories
            </FilterPill>
            {uniqueCats.map((c) => (
              <FilterPill
                key={c}
                active={catFilter === c}
                onClick={() => setCatFilter(c)}
                accent
              >
                {CAT_LABELS[c] ?? c}
              </FilterPill>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t mb-3" style={{ borderColor: "var(--blrd-border)" }} />

          {/* Row 2: Type filters + view toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-ui uppercase tracking-widest shrink-0 w-20"
              style={{ color: "var(--blrd-gray)" }}
            >
              Type
            </span>
            <FilterPill active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
              All Types
            </FilterPill>
            {uniqueTypes.map((t) => (
              <FilterPill
                key={t}
                active={typeFilter === t}
                onClick={() => setTypeFilter(t)}
              >
                {TYPE_LABELS[t] ?? t}
              </FilterPill>
            ))}

            {/* View toggle — icon-only, pushed to right */}
            <div className="flex gap-1 ml-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("cards")}
                    aria-label="Card view"
                    className="w-8 h-8 flex items-center justify-center rounded border transition-all"
                    style={{
                      background:
                        viewMode === "cards" ? "var(--blrd-dark-3)" : "transparent",
                      borderColor:
                        viewMode === "cards" ? "var(--blrd-cyan)" : "var(--blrd-border)",
                      color:
                        viewMode === "cards" ? "var(--blrd-cyan)" : "var(--blrd-gray)",
                    }}
                  >
                    <LayoutGrid size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Card view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                    className="w-8 h-8 flex items-center justify-center rounded border transition-all"
                    style={{
                      background:
                        viewMode === "table" ? "var(--blrd-dark-3)" : "transparent",
                      borderColor:
                        viewMode === "table" ? "var(--blrd-cyan)" : "var(--blrd-border)",
                      color:
                        viewMode === "table" ? "var(--blrd-cyan)" : "var(--blrd-gray)",
                    }}
                  >
                    <Table2 size={15} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Table view</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ── Content + right rail ── */}
        <div className="flex gap-8 items-start">
          {/* Main content column */}
          <div className="flex-1 min-w-0">
            {/* Section header */}
            <div className="section-header mb-4">
              <h2>Events</h2>
              <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
                {filtered.length} {filtered.length === 1 ? "event" : "events"}
                {(catFilter !== "all" || typeFilter !== "all") && " matching filters"}
              </span>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                className="rounded p-10 text-center"
                style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
              >
                <p className="font-display font-bold mb-2" style={{ color: "var(--blrd-white)" }}>
                  No events match your filters
                </p>
                <p className="text-sm mb-4" style={{ color: "var(--blrd-gray)" }}>
                  Try selecting "All Categories" or "All Types" to see more events.
                </p>
                <button
                  onClick={() => { setCatFilter("all"); setTypeFilter("all"); }}
                  className="px-4 py-2 rounded font-ui font-bold text-xs tracking-wider transition-all hover:brightness-110"
                  style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)" }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* ── Card view ── */}
            {viewMode === "cards" && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((event) => (
                  <div
                    key={event.id}
                    className="blrd-card group overflow-hidden cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                    role="article"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                        }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                        <span className={`blrd-tag blrd-tag-${event.category}`}>
                          {CAT_LABELS[event.category]}
                        </span>
                        {event.isVirtual && (
                          <span className="blrd-tag blrd-tag-tech">Virtual</span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <div className="text-xs font-ui" style={{ color: "var(--blrd-gray-light)" }}>
                          {formatDate(event.startDate)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className="blrd-tag text-xs"
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            color: "var(--blrd-gray-light)",
                            border: "1px solid var(--blrd-border)",
                          }}
                        >
                          {TYPE_LABELS[event.type]}
                        </span>
                      </div>
                      <h3
                        className="font-semibold text-sm leading-snug mb-2 transition-colors group-hover:text-cyan-400"
                        style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
                      >
                        {event.name}
                      </h3>
                      <div
                        className="flex items-center gap-3 text-xs font-ui"
                        style={{ color: "var(--blrd-gray)" }}
                      >
                        <span className="flex items-center gap-1">
                          {event.isVirtual ? <Monitor size={10} /> : <MapPin size={10} />}
                          {event.location}
                        </span>
                        <span className="ml-auto" style={{ color: "#00e676" }}>
                          {event.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Table view ── */}
            {viewMode === "table" && filtered.length > 0 && (
              <div
                className="overflow-x-auto rounded"
                style={{ border: "1px solid var(--blrd-border)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        background: "var(--blrd-dark-2)",
                        borderBottom: "1px solid var(--blrd-border)",
                      }}
                    >
                      {(
                        [
                          { key: "name", label: "Event Name" },
                          { key: "startDate", label: "Date" },
                          { key: "type", label: "Type" },
                          { key: "category", label: "Category" },
                          { key: "location", label: "Location" },
                        ] as { key: SortKey; label: string }[]
                      ).map((col) => (
                        <th
                          key={col.key}
                          className="text-left px-4 py-3 cursor-pointer select-none"
                          style={{
                            color: "var(--blrd-gray)",
                            fontFamily: "Rajdhani, sans-serif",
                            fontSize: "0.72rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                          onClick={() => handleSort(col.key)}
                        >
                          <span className="flex items-center gap-1">
                            {col.label}
                            <SortIcon col={col.key} />
                          </span>
                        </th>
                      ))}
                      <th
                        className="text-left px-4 py-3"
                        style={{
                          color: "var(--blrd-gray)",
                          fontFamily: "Rajdhani, sans-serif",
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((event, i) => (
                      <tr
                        key={event.id}
                        style={{
                          background:
                            i % 2 === 0 ? "var(--blrd-dark)" : "var(--blrd-dark-2)",
                          borderBottom: "1px solid var(--blrd-border)",
                        }}
                      >
                        <td className="px-4 py-3">
                          <div
                            className="font-semibold text-sm"
                            style={{
                              color: "var(--blrd-white)",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {event.name}
                          </div>
                          {event.isVirtual && (
                            <span className="blrd-tag blrd-tag-tech mt-1">Virtual</span>
                          )}
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-ui whitespace-nowrap"
                          style={{ color: "var(--blrd-gray-light)" }}
                        >
                          {formatDate(event.startDate)}
                          {event.endDate &&
                            event.endDate.toDateString() !== event.startDate.toDateString() && (
                              <div style={{ color: "var(--blrd-gray)" }}>
                                — {formatDate(event.endDate)}
                              </div>
                            )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="blrd-tag"
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              color: "var(--blrd-gray-light)",
                              border: "1px solid var(--blrd-border)",
                            }}
                          >
                            {TYPE_LABELS[event.type]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`blrd-tag blrd-tag-${event.category}`}>
                            {CAT_LABELS[event.category]}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-ui"
                          style={{ color: "var(--blrd-gray-light)" }}
                        >
                          <span className="flex items-center gap-1">
                            {event.isVirtual ? (
                              <Monitor size={11} />
                            ) : (
                              <MapPin size={11} />
                            )}
                            {event.location}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="text-xs px-3 py-1.5 rounded border font-ui font-semibold transition-colors hover:border-cyan-500 hover:text-cyan-400"
                            style={{
                              borderColor: "var(--blrd-border)",
                              color: "var(--blrd-gray-light)",
                            }}
                          >
                            Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile-only submit CTA (shown below content on small screens) */}
            <div
              className="mt-8 rounded p-5 text-center lg:hidden"
              style={{
                background: "var(--blrd-dark-2)",
                border: "1px solid var(--blrd-border)",
              }}
            >
              <h3
                className="font-display font-bold mb-1 text-sm"
                style={{ color: "var(--blrd-white)" }}
              >
                Know of an Event We Should List?
              </h3>
              <p className="text-xs mb-3" style={{ color: "var(--blrd-gray)" }}>
                Help us keep the community informed. Submit an event for consideration.
              </p>
              <a
                href="/contact"
                className="inline-block px-5 py-2 rounded font-ui font-bold text-xs tracking-wider transition-all hover:brightness-110"
                style={{
                  background: "var(--blrd-cyan)",
                  color: "var(--blrd-black)",
                  letterSpacing: "0.08em",
                }}
              >
                Submit an Event →
              </a>
            </div>
          </div>

          {/* Right-rail ad sidebar (desktop only) */}
          <EventsRightRail />
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </Layout>
  );
}
