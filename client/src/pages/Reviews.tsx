import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ExternalLink, Lock, Star } from "lucide-react";

// ─── Flame Rating Component ───────────────────────────────────────────────
function FlameRating({
  rating,
  max = 5,
  interactive = false,
  onRate,
  size = "md",
}: {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRate?: (val: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const [hover, setHover] = useState(0);
  const sizeMap = { sm: "0.9rem", md: "1.2rem", lg: "1.6rem" };
  const display = hover || rating;

  return (
    <span className="flame-rating" style={{ gap: size === "lg" ? "6px" : "3px" }}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`flame-icon ${i < Math.round(display) ? "active" : ""}`}
          style={{ fontSize: sizeMap[size], cursor: interactive ? "pointer" : "default" }}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i + 1)}
          title={interactive ? `Rate ${i + 1}/5 Flames` : `${rating}/5 Flames`}
        >
          🔥
        </span>
      ))}
    </span>
  );
}

// ─── External Ratings ─────────────────────────────────────────────────────
function ExternalRatings({ ratings }: { ratings: { source: string; score: string; outOf: string; url?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {ratings.map((r) => (
        <a
          key={r.source}
          href={r.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded border transition-colors hover:border-cyan-500 group"
          style={{ background: "var(--blrd-dark-3)", borderColor: "var(--blrd-border)" }}
        >
          <span className="text-xs font-ui font-semibold" style={{ color: "var(--blrd-gray)" }}>
            {r.source}
          </span>
          <span className="text-sm font-display font-bold" style={{ color: "var(--blrd-white)" }}>
            {r.score}
          </span>
          <span className="text-xs" style={{ color: "var(--blrd-gray)" }}>/ {r.outOf}</span>
          <ExternalLink size={10} style={{ color: "var(--blrd-gray)" }} className="group-hover:text-cyan-400" />
        </a>
      ))}
    </div>
  );
}

// ─── Review Data ──────────────────────────────────────────────────────────
const REVIEW_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "games", label: "Games" },
  { id: "tv", label: "TV" },
  { id: "movies", label: "Movies" },
  { id: "comics", label: "Comics" },
  { id: "music", label: "Music" },
];

const REVIEWS_DATA = [
  // GAMES (2)
  {
    id: 1, category: "games", tag: "games",
    title: "Elden Ring: Shadow of the Erdtree",
    subtitle: "FromSoftware / Bandai Namco | 2024 | PC, PS5, Xbox",
    blrdRating: 5.0, blrdRatingCount: 847,
    summary: "Shadow of the Erdtree doesn't just expand Elden Ring — it redefines what DLC can be. The Land of Shadow is a masterpiece of environmental storytelling, filled with secrets that reward the most dedicated explorers. The new weapon types and boss encounters push the combat system to its absolute limit. This is FromSoftware at the peak of their craft.",
    pros: ["Breathtaking new open world", "Incredible boss design", "Deep lore expansion", "New weapons add combat depth"],
    cons: ["Brutal difficulty spike", "Some legacy dungeon quality inconsistency"],
    verdict: "Essential. Shadow of the Erdtree is the gold standard for expansion content.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    externalRatings: [
      { source: "IGN", score: "10", outOf: "10", url: "https://ign.com" },
      { source: "Metacritic", score: "95", outOf: "100", url: "https://metacritic.com" },
      { source: "OpenCritic", score: "94", outOf: "100", url: "https://opencritic.com" },
      { source: "GameSpot", score: "10", outOf: "10", url: "https://gamespot.com" },
    ],
  },
  {
    id: 2, category: "games", tag: "games",
    title: "Tekken 8",
    subtitle: "Bandai Namco | 2024 | PC, PS5, Xbox Series X",
    blrdRating: 4.0, blrdRatingCount: 412,
    summary: "Tekken 8 is the most accessible entry in the franchise without sacrificing the depth that veterans love. The Heat System adds a new layer of strategy, and the roster is packed with memorable characters. The story mode is surprisingly engaging, and the online infrastructure is the best the series has ever had. A few balance issues keep it from perfection.",
    pros: ["Excellent roster diversity", "Heat System adds depth", "Best online in series history", "Stunning visuals"],
    cons: ["Some character balance issues", "Story mode pacing drags in places"],
    verdict: "A landmark fighting game that welcomes newcomers while rewarding veterans.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    externalRatings: [
      { source: "IGN", score: "9", outOf: "10" },
      { source: "Metacritic", score: "90", outOf: "100" },
      { source: "OpenCritic", score: "89", outOf: "100" },
    ],
  },
  // TV (2)
  {
    id: 3, category: "tv", tag: "tv",
    title: "Andor Season 2",
    subtitle: "Disney+ | 2025 | Tony Gilroy",
    blrdRating: 5.0, blrdRatingCount: 623,
    summary: "Andor Season 2 completes one of the most ambitious political dramas in Star Wars history. Tony Gilroy's writing is razor-sharp — every scene earns its place, and the performances are uniformly excellent. This is Star Wars as genuine adult science fiction, exploring themes of resistance, sacrifice, and moral compromise with a depth the franchise rarely achieves.",
    pros: ["Exceptional writing and performances", "Mature political storytelling", "Stunning production design", "Satisfying character arcs"],
    cons: ["Slower pace may not suit all viewers", "Requires investment in Season 1"],
    verdict: "The best Star Wars content ever made. A genuine masterpiece of television.",
    image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=600&q=80",
    externalRatings: [
      { source: "Rotten Tomatoes", score: "98%", outOf: "100%" },
      { source: "IMDb", score: "9.2", outOf: "10" },
      { source: "Metacritic", score: "94", outOf: "100" },
    ],
  },
  {
    id: 4, category: "tv", tag: "tv",
    title: "The Last of Us Season 2",
    subtitle: "HBO | 2025 | Craig Mazin & Neil Druckmann",
    blrdRating: 4.0, blrdRatingCount: 891,
    summary: "The Last of Us Season 2 adapts the divisive second game with confidence and craft. The performances — particularly Bella Ramsey and Kaitlyn Dever — are extraordinary. The show doesn't shy away from the source material's moral complexity, and the production values remain among the best on television. Some pacing issues in the middle episodes prevent it from reaching Season 1's heights.",
    pros: ["Outstanding lead performances", "Faithful to source material", "Stunning cinematography", "Emotionally devastating when it lands"],
    cons: ["Uneven pacing mid-season", "Some storylines feel rushed"],
    verdict: "A worthy continuation that proves the series can handle difficult material with grace.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80",
    externalRatings: [
      { source: "Rotten Tomatoes", score: "91%", outOf: "100%" },
      { source: "IMDb", score: "8.7", outOf: "10" },
      { source: "Metacritic", score: "88", outOf: "100" },
    ],
  },
  // MOVIES (2)
  {
    id: 5, category: "movies", tag: "movies",
    title: "Nope",
    subtitle: "Universal Pictures | 2022 | Jordan Peele",
    blrdRating: 5.0, blrdRatingCount: 534,
    summary: "Jordan Peele's third film is his most ambitious and visually stunning work yet. Nope operates on multiple levels simultaneously — as a spectacle film, a meditation on exploitation and spectacle itself, and a deeply personal story about Black legacy in Hollywood. Daniel Kaluuya and Keke Palmer deliver career-best performances, and the final act is unlike anything else in modern cinema.",
    pros: ["Visually extraordinary", "Layered thematic depth", "Career-best performances", "Genuinely original concept"],
    cons: ["Some viewers may want more conventional horror beats"],
    verdict: "A singular cinematic vision that demands multiple viewings to fully appreciate.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    externalRatings: [
      { source: "Rotten Tomatoes", score: "83%", outOf: "100%" },
      { source: "IMDb", score: "6.8", outOf: "10" },
      { source: "Metacritic", score: "73", outOf: "100" },
    ],
  },
  {
    id: 6, category: "movies", tag: "movies",
    title: "Spider-Man: Across the Spider-Verse",
    subtitle: "Sony Pictures | 2023 | Kemp Powers, Joaquim Dos Santos, Justin K. Thompson",
    blrdRating: 5.0, blrdRatingCount: 1204,
    summary: "Across the Spider-Verse doesn't just raise the bar for animated filmmaking — it demolishes it. The visual innovation is staggering, with each universe rendered in a distinct artistic style. But the real achievement is emotional: Miles Morales's story is told with a depth and specificity that makes it universally resonant. The ending is genuinely bold.",
    pros: ["Revolutionary animation", "Emotionally resonant story", "Incredible voice performances", "Bold creative choices"],
    cons: ["Cliffhanger ending requires Part 2", "Sensory overload for some viewers"],
    verdict: "One of the greatest animated films ever made. Essential viewing.",
    image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    externalRatings: [
      { source: "Rotten Tomatoes", score: "95%", outOf: "100%" },
      { source: "IMDb", score: "8.7", outOf: "10" },
      { source: "Metacritic", score: "86", outOf: "100" },
    ],
  },
  // COMICS (2)
  {
    id: 7, category: "comics", tag: "comics",
    title: "Absolute Batman #1",
    subtitle: "DC Comics | 2024 | Scott Snyder & Nick Dragotta",
    blrdRating: 4.0, blrdRatingCount: 287,
    summary: "Scott Snyder and Nick Dragotta's reimagining of Bruce Wayne strips the character back to his most essential elements and rebuilds him from scratch. This Bruce is working-class, scrappy, and genuinely terrifying to criminals. Dragotta's art is kinetic and expressive in ways that feel fresh for a Batman book. A bold start to DC's Absolute Universe.",
    pros: ["Fresh take on a classic character", "Dragotta's art is exceptional", "Compelling new status quo", "Accessible to new readers"],
    cons: ["Some longtime fans may resist the changes", "First issue is mostly setup"],
    verdict: "The most exciting Batman debut in years. DC is swinging for the fences.",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    externalRatings: [
      { source: "ComicBookRoundUp", score: "9.0", outOf: "10" },
      { source: "IGN", score: "9", outOf: "10" },
    ],
  },
  {
    id: 8, category: "comics", tag: "comics",
    title: "Miles Morales: Spider-Man Vol. 3",
    subtitle: "Marvel Comics | 2024 | Cody Ziglar & Federico Vicentini",
    blrdRating: 4.0, blrdRatingCount: 198,
    summary: "Cody Ziglar's run on Miles Morales continues to be one of Marvel's most consistently excellent books. This volume deepens Miles's supporting cast and pushes him into genuinely dangerous territory. Vicentini's art captures both the kinetic energy of the action sequences and the quieter emotional moments with equal skill. Essential reading for fans of the character.",
    pros: ["Strong character development", "Excellent supporting cast", "Vicentini's art is top-tier", "Great balance of action and heart"],
    cons: ["Some tie-in issues interrupt the flow", "Requires some Marvel knowledge"],
    verdict: "The definitive Miles Morales run of this generation.",
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=600&q=80",
    externalRatings: [
      { source: "ComicBookRoundUp", score: "8.5", outOf: "10" },
      { source: "IGN", score: "8", outOf: "10" },
    ],
  },
  // MUSIC (2)
  {
    id: 9, category: "music", tag: "music",
    title: "Kendrick Lamar — GNX",
    subtitle: "pgLang / Interscope | 2024 | Hip-Hop",
    blrdRating: 5.0, blrdRatingCount: 1876,
    summary: "GNX arrives as both a victory lap and a creative statement. After the cultural moment of 'Not Like Us,' Kendrick delivers an album that's simultaneously celebratory and introspective. The West Coast production is lush and layered, and Lamar's pen remains unmatched. This is an artist at the absolute peak of his powers, comfortable enough to be vulnerable and triumphant at the same time.",
    pros: ["Exceptional lyricism", "Cohesive West Coast production", "Emotionally complex", "Culturally significant"],
    cons: ["Short runtime leaves you wanting more"],
    verdict: "A landmark album from one of the greatest artists of his generation.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    externalRatings: [
      { source: "Pitchfork", score: "9.2", outOf: "10" },
      { source: "AllMusic", score: "4.5", outOf: "5" },
      { source: "Metacritic", score: "91", outOf: "100" },
    ],
  },
  {
    id: 10, category: "music", tag: "music",
    title: "Childish Gambino — Atavista",
    subtitle: "Wolf + Rothstein / RCA | 2024 | R&B/Hip-Hop",
    blrdRating: 4.0, blrdRatingCount: 643,
    summary: "Donald Glover's final Childish Gambino album is a sprawling, ambitious farewell that rewards patient listening. Atavista blends R&B, funk, jazz, and hip-hop into something genuinely singular. It's not always cohesive, but the highs are extraordinary — particularly the album's emotional centerpiece tracks. A fitting conclusion to one of the most eclectic musical careers of the 2010s.",
    pros: ["Genre-defying ambition", "Stunning production", "Emotionally resonant peaks", "Excellent features"],
    cons: ["Uneven pacing", "Some tracks feel unfinished"],
    verdict: "An imperfect but genuinely moving farewell from a singular artist.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    externalRatings: [
      { source: "Pitchfork", score: "7.8", outOf: "10" },
      { source: "AllMusic", score: "4.0", outOf: "5" },
      { source: "Metacritic", score: "82", outOf: "100" },
    ],
  },
];

// ─── Review Card ──────────────────────────────────────────────────────────
function ReviewCard({ review, onSelect }: { review: typeof REVIEWS_DATA[0]; onSelect: () => void }) {
  return (
    <div className="blrd-card group overflow-hidden cursor-pointer" onClick={onSelect}>
      <div className="h-40 overflow-hidden relative">
        <img
          src={review.image}
          alt={review.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-3 left-3">
          <FlameRating rating={review.blrdRating} size="md" />
          <div className="text-xs font-ui mt-0.5" style={{ color: "var(--blrd-gray)" }}>
            {review.blrdRatingCount.toLocaleString()} ratings
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`blrd-tag blrd-tag-${review.tag}`}>{review.category}</span>
        </div>
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-sm leading-snug mb-1 transition-colors group-hover:text-cyan-400"
          style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
        >
          {review.title}
        </h3>
        <p className="text-xs mb-3" style={{ color: "var(--blrd-gray)" }}>
          {review.subtitle}
        </p>
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--blrd-gray-light)" }}>
          {review.summary}
        </p>
      </div>
    </div>
  );
}

// ─── Review Detail Modal ──────────────────────────────────────────────────
function ReviewModal({
  review,
  onClose,
}: {
  review: typeof REVIEWS_DATA[0];
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const submitRating = trpc.reviews.rate.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(`You rated ${review.title} ${userRating}/5 Flames! 🔥`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit rating");
    },
  });

  const handleRate = (val: number) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to rate content");
      return;
    }
    setUserRating(val);
  };

  const handleSubmit = () => {
    if (!userRating) return;
    submitRating.mutate({ contentId: review.id, rating: userRating });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded"
        style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
      >
        {/* Header Image */}
        <div className="relative h-56">
          <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors hover:bg-white/20"
            style={{ background: "rgba(0,0,0,0.7)", color: "var(--blrd-white)" }}
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`blrd-tag blrd-tag-${review.tag} mb-2 inline-block`}>{review.category}</span>
            <h2 className="font-display font-bold text-xl" style={{ color: "var(--blrd-white)" }}>
              {review.title}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--blrd-gray)" }}>{review.subtitle}</p>
          </div>
        </div>

        <div className="p-6">
          {/* BLRD Rating */}
          <div
            className="flex items-center gap-4 p-4 rounded mb-4"
            style={{ background: "var(--blrd-dark-3)", border: "1px solid var(--blrd-border)" }}
          >
            <div>
              <div className="text-xs font-display font-bold mb-1 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
                BLRD Rating
              </div>
              <FlameRating rating={review.blrdRating} size="lg" />
              <div className="text-xs mt-1 font-ui" style={{ color: "var(--blrd-gray)" }}>
                {review.blrdRating.toFixed(1)} / 5 · {review.blrdRatingCount.toLocaleString()} community ratings
              </div>
            </div>
          </div>

          {/* External Ratings */}
          <div className="mb-4">
            <div className="text-xs font-display font-bold mb-2 tracking-widest uppercase" style={{ color: "var(--blrd-gray)" }}>
              Other Critics
            </div>
            <ExternalRatings ratings={review.externalRatings} />
          </div>

          {/* Review Body */}
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--blrd-gray-light)" }}>
            {review.summary}
          </p>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded p-3" style={{ background: "rgba(27,201,201,0.05)", border: "1px solid rgba(27,201,201,0.15)" }}>
              <div className="text-xs font-display font-bold mb-2" style={{ color: "var(--blrd-cyan)" }}>✓ PROS</div>
              {review.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs mb-1" style={{ color: "var(--blrd-gray-light)" }}>
                  <span style={{ color: "var(--blrd-cyan)" }}>+</span> {p}
                </div>
              ))}
            </div>
            <div className="rounded p-3" style={{ background: "rgba(255,87,34,0.05)", border: "1px solid rgba(255,87,34,0.15)" }}>
              <div className="text-xs font-display font-bold mb-2" style={{ color: "var(--blrd-flame)" }}>CONS</div>
              {review.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs mb-1" style={{ color: "var(--blrd-gray-light)" }}>
                  <span style={{ color: "var(--blrd-flame)" }}>−</span> {c}
                </div>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <div
            className="rounded p-4 mb-6"
            style={{ background: "rgba(27,201,201,0.06)", border: "1px solid rgba(27,201,201,0.2)" }}
          >
            <div className="text-xs font-display font-bold mb-1 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
              BLRD Verdict
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--blrd-white)", fontFamily: "Inter, sans-serif" }}>
              {review.verdict}
            </p>
          </div>

          {/* Rate This */}
          <div
            className="rounded p-4"
            style={{ background: "var(--blrd-dark-3)", border: "1px solid var(--blrd-border)" }}
          >
            <div className="text-xs font-display font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-white)" }}>
              Rate This
            </div>
            {submitted ? (
              <div className="text-sm font-ui" style={{ color: "var(--blrd-cyan)" }}>
                ✓ Thanks for your rating! Your flames have been counted.
              </div>
            ) : isAuthenticated ? (
              <div>
                <p className="text-xs mb-3" style={{ color: "var(--blrd-gray)" }}>
                  How many flames does this deserve?
                </p>
                <FlameRating rating={userRating} interactive onRate={handleRate} size="lg" />
                {userRating > 0 && (
                  <button
                    onClick={handleSubmit}
                    disabled={submitRating.isPending}
                    className="mt-3 px-4 py-2 rounded text-xs font-ui font-bold tracking-wider transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.08em" }}
                  >
                    {submitRating.isPending ? "Submitting..." : `Submit ${userRating}/5 Flames`}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Lock size={14} style={{ color: "var(--blrd-gray)" }} />
                <span className="text-xs" style={{ color: "var(--blrd-gray)" }}>
                  Sign in to rate this content
                </span>
                <a
                  href={getLoginUrl()}
                  className="px-3 py-1.5 rounded text-xs font-ui font-bold transition-all hover:brightness-110"
                  style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)" }}
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Reviews Page ────────────────────────────────────────────────────
export default function Reviews() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedReview, setSelectedReview] = useState<typeof REVIEWS_DATA[0] | null>(null);

  const filtered =
    activeCategory === "all"
      ? REVIEWS_DATA
      : REVIEWS_DATA.filter((r) => r.category === activeCategory);

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold mb-1" style={{ color: "var(--blrd-white)" }}>
          Reviews
        </h1>
        <p className="text-sm" style={{ color: "var(--blrd-gray)" }}>
          Community-powered ratings using the BLRD Flames system (0–5 🔥). Sign in to add your rating.
        </p>
      </div>

      {/* Rating System Explainer */}
      <div
        className="rounded p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
      >
        <div className="flex-1">
          <div className="text-xs font-display font-bold mb-1 tracking-widest uppercase" style={{ color: "var(--blrd-flame)" }}>
            The BLRD Flames System
          </div>
          <p className="text-xs" style={{ color: "var(--blrd-gray)" }}>
            Our community-driven rating system. Every signed-in member can rate content from 0–5 Flames. The displayed score is the average of all community ratings.
          </p>
        </div>
        <div className="flex gap-3 text-xs shrink-0">
          {[
            { flames: 1, label: "Skip It" },
            { flames: 2, label: "Meh" },
            { flames: 3, label: "Solid" },
            { flames: 4, label: "Fire" },
            { flames: 5, label: "GOAT" },
          ].map((r) => (
            <div key={r.flames} className="text-center">
              <FlameRating rating={r.flames} size="sm" />
              <div className="mt-0.5 font-ui" style={{ color: "var(--blrd-gray)" }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {REVIEW_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-3 py-1.5 text-xs rounded border transition-all font-ui font-semibold tracking-wide"
            style={{
              background: activeCategory === cat.id ? "var(--blrd-flame)" : "var(--blrd-dark-2)",
              borderColor: activeCategory === cat.id ? "var(--blrd-flame)" : "var(--blrd-border)",
              color: activeCategory === cat.id ? "var(--blrd-white)" : "var(--blrd-gray-light)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="section-header">
        <h2>{activeCategory === "all" ? "All Reviews" : REVIEW_CATEGORIES.find((c) => c.id === activeCategory)?.label}</h2>
        <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>{filtered.length} reviews</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((review) => (
          <ReviewCard key={review.id} review={review} onSelect={() => setSelectedReview(review)} />
        ))}
      </div>

      {/* Modal */}
      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </Layout>
  );
}
