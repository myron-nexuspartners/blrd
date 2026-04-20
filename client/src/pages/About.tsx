import Layout from "@/components/Layout";
import { Link } from "wouter";
import { Flame, Users, Zap, Globe, Star, Target, Trophy, Rocket, TrendingUp, MapPin } from "lucide-react";

const PILLARS = [
  {
    icon: <Flame size={24} />,
    color: "var(--blrd-flame)",
    title: "Authentic Voices",
    body: "We celebrate creators and critics who bring genuine passion and fresh perspectives to gaming, comics, film, and technology. No corporate filters. No watered-down takes.",
  },
  {
    icon: <Users size={24} />,
    color: "var(--blrd-cyan)",
    title: "Community First",
    body: "BLRD is built by fans, for fans. Every feature — from user ratings to community blog posts — exists to amplify the voices of passionate geek culture enthusiasts.",
  },
  {
    icon: <Zap size={24} />,
    color: "var(--blrd-amber)",
    title: "Hype & Energy",
    body: "We don't do boring. BLRD covers the culture with the same energy you bring to your favorite game, show, or comic run. We're as excited about this stuff as you are.",
  },
  {
    icon: <Globe size={24} />,
    color: "var(--blrd-cyan)",
    title: "Connecting Communities",
    body: "From Kansas City to everywhere, BLRD connects fans, creators, and brands across the full spectrum of geek culture. If you're passionate about it, you belong here.",
  },
  {
    icon: <Star size={24} />,
    color: "var(--blrd-orange)",
    title: "Quality Entertainment",
    body: "We hold ourselves to the same standard we hold the content we cover. Thoughtful storytelling, rigorous criticism, and creative content — always.",
  },
  {
    icon: <Target size={24} />,
    color: "var(--blrd-cyan)",
    title: "Innovation in Content",
    body: "BLRD is pioneering new approaches to geek culture media — from our custom Flames rating system to our Discover platform for premium creator content.",
  },
];

const TIMELINE = [
  {
    phase: "Launch",
    period: "Q2 2026 — Now",
    color: "var(--blrd-cyan)",
    status: "active",
    icon: "rocket",
    milestones: [
      "Site live: all 8 content verticals publishing daily",
      "AI-powered content pipeline operational (10–12 articles/day)",
      "5 beat writer personas active across all verticals",
      "Seed audience: 5,000 social media followers across platforms",
      "First ad revenue: direct brand partnerships + programmatic",
      "Community features live: ratings, blog submissions, events",
    ],
  },
  {
    phase: "Momentum",
    period: "Q3–Q4 2026",
    color: "var(--blrd-amber)",
    status: "upcoming",
    icon: "trending",
    milestones: [
      "Reach 25,000 social media followers",
      "$15,000+ monthly recurring revenue (ads + sponsorships)",
      "Launch BLRD Podcast Network — one show per vertical",
      "First live event presence: The Game Awards 2026 (Los Angeles)",
      "Discover platform: 10+ active brand/creator sponsorships",
      "Break-even achieved; first month of net profit",
    ],
  },
  {
    phase: "Scale",
    period: "Q1–Q2 2027",
    color: "var(--blrd-orange)",
    status: "upcoming",
    icon: "trophy",
    events: [
      { name: "CES 2027", location: "Las Vegas, NV", month: "Jan 2027" },
      { name: "SXSW 2027", location: "Austin, TX", month: "Mar 2027" },
      { name: "BlerdCon 2027", location: "Washington, D.C.", month: "Jul 2027" },
    ],
    milestones: [
      "100,000+ social media followers across all platforms",
      "$50,000+ monthly revenue; consistent profitability",
      "Expand team to 8 full-time staff + 15 contributing creators",
      "Booth presence at CES 2027 — Technology & Culture vertical launch",
      "Booth presence at SXSW 2027 — Creator Economy & Music/Movies",
      "Anchor booth at BlerdCon 2027 — flagship community event",
      "Launch BLRD Premium subscription tier",
      "US eSports circuit coverage: LCS, CDL, Valorant Champions",
    ],
  },
  {
    phase: "Expansion",
    period: "Q3–Q4 2027",
    color: "var(--blrd-cyan)",
    status: "upcoming",
    icon: "globe",
    events: [
      { name: "San Diego Comic-Con", location: "San Diego, CA", month: "Jul 2027" },
      { name: "New York Comic Con", location: "New York, NY", month: "Oct 2027" },
      { name: "KC Comic Con", location: "Kansas City, MO", month: "Sep 2027" },
      { name: "The Game Awards 2027", location: "Los Angeles, CA", month: "Dec 2027" },
    ],
    milestones: [
      "250,000+ social media followers; 500K monthly unique visitors",
      "$100,000+ monthly revenue; $1M+ ARR milestone",
      "Booth presence at San Diego Comic-Con, NYCC, and KC Comic Con",
      "International expansion: UK eSports coverage (ESL UK, Belong)",
      "LatAm market entry: Brasil Game Show + LLA eSports partnerships",
      "BLRD Awards debut at The Game Awards 2027 activation",
      "Mobile app launch: iOS + Android",
      "Series A fundraising or strategic partnership secured",
    ],
  },
];

export default function About() {
  return (
    <Layout showSidebar={false}>
      {/* Hero */}
      <div
        className="relative py-20 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(27,201,201,0.08) 0%, rgba(0,0,0,1) 50%, rgba(255,87,34,0.05) 100%)",
          borderBottom: "1px solid var(--blrd-border)",
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(var(--blrd-border) 1px, transparent 1px), linear-gradient(90deg, var(--blrd-border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="blrd-tag blrd-tag-creators mb-4 inline-block">About BLRD</span>
            <h1
              className="font-display font-black mb-6 leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--blrd-white)",
              }}
            >
              Why{" "}
              <span className="blrd-glow" style={{ color: "var(--blrd-cyan)" }}>
                BLRD
              </span>{" "}
              Exists
            </h1>
            <p
              className="text-lg leading-relaxed mb-4"
              style={{ color: "var(--blrd-gray-light)", maxWidth: "600px" }}
            >
              The global gaming market is valued at over $200 billion. Diverse audiences represent 45% of all gamers. Yet mainstream outlets consistently overlook the perspectives, stories, and communities that make geek culture truly rich.
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--blrd-gray-light)", maxWidth: "600px" }}
            >
              <strong style={{ color: "var(--blrd-white)" }}>BLRD was built to change that.</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div
            className="rounded p-8"
            style={{
              background: "var(--blrd-dark-2)",
              border: "1px solid var(--blrd-border)",
              borderTop: "3px solid var(--blrd-cyan)",
            }}
          >
            <h2
              className="font-display text-sm font-bold mb-4 tracking-widest uppercase"
              style={{ color: "var(--blrd-cyan)" }}
            >
              Our Mission
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--blrd-gray-light)" }}>
              Blerd Vision Entertainment produces high-quality, culturally relevant content that informs, entertains, and connects diverse communities within pop-culture, gaming, and technology spaces — while building sustainable business opportunities for creators and partners.
            </p>
          </div>
          <div
            className="rounded p-8"
            style={{
              background: "var(--blrd-dark-2)",
              border: "1px solid var(--blrd-border)",
              borderTop: "3px solid var(--blrd-orange)",
            }}
          >
            <h2
              className="font-display text-sm font-bold mb-4 tracking-widest uppercase"
              style={{ color: "var(--blrd-orange)" }}
            >
              Our Vision
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--blrd-gray-light)" }}>
              To become the leading voice and platform for authentic perspectives in pop-culture, gaming, and technology — creating a home where passionate fans find stories that reflect the full spectrum of human experience and connect with communities that truly get their interests.
            </p>
          </div>
        </div>

        {/* What We Cover */}
        <div className="mb-16">
          <div className="section-header">
            <h2>What We Cover</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Gaming", tag: "gaming", desc: "News, reviews, esports, and deep dives into gaming culture" },
              { label: "Comics", tag: "comics", desc: "Indie, mainstream, and everything in between" },
              { label: "Movies", tag: "film", desc: "Film criticism, trailers, and industry news" },
              { label: "TV", tag: "tv", desc: "Streaming, broadcast, and the shows worth your time" },
              { label: "Creators", tag: "creators", desc: "Spotlights on the voices shaping the culture" },
            ].map((item) => (
              <div
                key={item.label}
                className="blrd-card p-4 text-center"
              >
                <span className={`blrd-tag blrd-tag-${item.tag} mb-3 inline-block`}>{item.label}</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--blrd-gray)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Pillars */}
        <div className="mb-16">
          <div className="section-header">
            <h2>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="blrd-card p-6"
                style={{ borderLeft: `3px solid ${pillar.color}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ color: pillar.color }}>{pillar.icon}</span>
                  <h3
                    className="font-display text-sm font-bold"
                    style={{ color: "var(--blrd-white)" }}
                  >
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--blrd-gray)" }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The Community */}
        <div
          className="rounded p-8 mb-16"
          style={{
            background: "linear-gradient(135deg, rgba(27,201,201,0.08) 0%, rgba(255,87,34,0.05) 100%)",
            border: "1px solid rgba(27,201,201,0.2)",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-display font-bold mb-4"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: "var(--blrd-white)" }}
            >
              A Community for Creative Critical Thinkers
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--blrd-gray-light)" }}>
              BLRD isn't just a media outlet — it's a connector. We're building a space where fans become critics, critics become creators, and creators find the audience they deserve. Whether you're a lifelong gamer, a comics obsessive, a film theory nerd, or someone who just discovered their first anime — you belong here.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--blrd-gray-light)" }}>
              Our community features — from user ratings and blog submissions to event listings and the Discover platform — are designed to give every member a voice and a role in shaping what BLRD becomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/blog">
                <button
                  className="px-6 py-3 rounded font-ui font-bold tracking-wider text-sm transition-all hover:brightness-110"
                  style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.1em" }}
                >
                  Submit a Blog Post
                </button>
              </Link>
              <Link href="/reviews">
                <button
                  className="px-6 py-3 rounded font-ui font-bold tracking-wider text-sm transition-all border hover:border-cyan-500 hover:text-cyan-400"
                  style={{ borderColor: "var(--blrd-border)", color: "var(--blrd-gray-light)", letterSpacing: "0.1em" }}
                >
                  Rate & Review Content
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <div className="section-header">
            <Rocket size={14} style={{ color: "var(--blrd-cyan)" }} />
            <h2>Growth Roadmap</h2>
            <span className="ml-auto text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
              April 2026 — December 2027
            </span>
          </div>

          {/* Timeline connector line (desktop) */}
          <div className="relative">
            <div
              className="hidden lg:block absolute top-8 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, var(--blrd-cyan), var(--blrd-amber), var(--blrd-orange), var(--blrd-cyan))", opacity: 0.3, zIndex: 0 }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative" style={{ zIndex: 1 }}>
              {TIMELINE.map((phase) => {
                const phaseIcon = phase.icon === "rocket" ? <Rocket size={16} />
                  : phase.icon === "trending" ? <TrendingUp size={16} />
                  : phase.icon === "trophy" ? <Trophy size={16} />
                  : <Globe size={16} />;

                return (
                  <div
                    key={phase.phase}
                    className="blrd-card p-5 flex flex-col gap-3"
                    style={{
                      borderTop: `3px solid ${phase.color}`,
                      boxShadow: phase.status === "active" ? `0 0 20px ${phase.color}22` : undefined,
                    }}
                  >
                    {/* Phase header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span style={{ color: phase.color }}>{phaseIcon}</span>
                          <h3 className="font-display text-sm font-bold" style={{ color: phase.color }}>
                            {phase.phase}
                          </h3>
                        </div>
                        <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
                          {phase.period}
                        </span>
                      </div>
                      {phase.status === "active" && (
                        <span
                          className="text-xs font-display font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: "rgba(27,201,201,0.15)",
                            color: "var(--blrd-cyan)",
                            border: "1px solid rgba(27,201,201,0.3)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>

                    {/* Event signposts */}
                    {"events" in phase && phase.events && phase.events.length > 0 && (
                      <div
                        className="rounded p-3"
                        style={{ background: "rgba(255,87,34,0.06)", border: "1px solid rgba(255,87,34,0.15)" }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <MapPin size={11} style={{ color: "var(--blrd-orange)" }} />
                          <span
                            className="text-xs font-display font-bold uppercase tracking-wider"
                            style={{ color: "var(--blrd-orange)" }}
                          >
                            Event Presence
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {phase.events.map((ev: { name: string; location: string; month: string }) => (
                            <div key={ev.name} className="flex items-start justify-between gap-1">
                              <span className="text-xs font-semibold" style={{ color: "var(--blrd-white)", fontFamily: "Inter, sans-serif" }}>
                                {ev.name}
                              </span>
                              <span className="text-xs shrink-0" style={{ color: "var(--blrd-gray)" }}>
                                {ev.month}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    <ul className="flex flex-col gap-2">
                      {phase.milestones.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--blrd-gray-light)" }}>
                          <span style={{ color: phase.color, marginTop: "2px", flexShrink: 0 }}>▸</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event calendar strip */}
          <div
            className="mt-6 rounded p-5"
            style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={14} style={{ color: "var(--blrd-amber)" }} />
              <h3
                className="font-display text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--blrd-amber)" }}
              >
                Confirmed Event Targets 2026–2027
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: "The Game Awards", location: "Los Angeles, CA", date: "Dec 2026", tag: "gaming", region: "US" },
                { name: "CES 2027", location: "Las Vegas, NV", date: "Jan 2027", tag: "tech", region: "US" },
                { name: "SXSW 2027", location: "Austin, TX", date: "Mar 2027", tag: "culture", region: "US" },
                { name: "BlerdCon 2027", location: "Washington, D.C.", date: "Jul 2027", tag: "creators", region: "US" },
                { name: "San Diego Comic-Con", location: "San Diego, CA", date: "Jul 2027", tag: "comics", region: "US" },
                { name: "KC Comic Con", location: "Kansas City, MO", date: "Sep 2027", tag: "comics", region: "US" },
                { name: "New York Comic Con", location: "New York, NY", date: "Oct 2027", tag: "comics", region: "US" },
                { name: "ESL UK Major", location: "London, UK", date: "TBD 2027", tag: "gaming", region: "UK" },
                { name: "Brasil Game Show", location: "São Paulo, BR", date: "Oct 2027", tag: "gaming", region: "LatAm" },
                { name: "LLA eSports Finals", location: "Mexico City, MX", date: "TBD 2027", tag: "gaming", region: "LatAm" },
                { name: "The Game Awards 2027", location: "Los Angeles, CA", date: "Dec 2027", tag: "gaming", region: "US" },
                { name: "Valorant Champions", location: "US Tour", date: "2027", tag: "gaming", region: "US" },
              ].map((ev) => (
                <div
                  key={ev.name + ev.date}
                  className="rounded p-3"
                  style={{ background: "var(--blrd-dark-3)", border: "1px solid var(--blrd-border)" }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`blrd-tag blrd-tag-${ev.tag}`} style={{ fontSize: "0.55rem" }}>
                      {ev.region}
                    </span>
                    <span className="text-xs" style={{ color: "var(--blrd-gray)", fontSize: "0.6rem" }}>
                      {ev.date}
                    </span>
                  </div>
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{ color: "var(--blrd-white)", fontFamily: "Inter, sans-serif" }}
                  >
                    {ev.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--blrd-gray)", fontSize: "0.6rem" }}>
                    {ev.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="mb-16">
          <div className="section-header">
            <h2>The Opportunity</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "$503B", label: "Global gaming market by 2025", color: "var(--blrd-cyan)" },
              { value: "45%", label: "Of all gamers are from diverse backgrounds", color: "var(--blrd-orange)" },
              { value: "12M", label: "Addressable market in the US", color: "var(--blrd-cyan)" },
              { value: "$38.2B", label: "Digital content creation market by 2030", color: "var(--blrd-amber)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="blrd-card p-5 text-center"
              >
                <div
                  className="font-display font-black mb-2"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: stat.color }}
                >
                  {stat.value}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--blrd-gray)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div
          className="rounded p-8 text-center"
          style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
        >
          <h2 className="font-display font-bold mb-3" style={{ color: "var(--blrd-white)", fontSize: "1.2rem" }}>
            Want to Partner with BLRD?
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--blrd-gray-light)" }}>
            We're building something special. If you're a brand, creator, or organization that wants to connect with passionate geek culture communities, let's talk.
          </p>
          <Link href="/contact">
            <button
              className="px-6 py-3 rounded font-ui font-bold tracking-wider text-sm transition-all hover:brightness-110"
              style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.1em" }}
            >
              Get in Touch →
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
