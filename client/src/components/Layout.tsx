import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Menu, X, Search, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/discover", label: "Discover" },
  { href: "/reviews", label: "Reviews" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { label: "Twitter/X", href: "https://twitter.com/blrdvision", icon: "𝕏" },
  { label: "Instagram", href: "https://instagram.com/blrdvision", icon: "📸" },
  { label: "YouTube", href: "https://youtube.com/@blrdvision", icon: "▶" },
  { label: "TikTok", href: "https://tiktok.com/@blrdvision", icon: "♪" },
  { label: "Twitch", href: "https://twitch.tv/blrdvision", icon: "🎮" },
];

export function AdBannerTop() {
  return (
    <div className="ad-zone ad-banner-top">
      <span className="mt-4 text-xs opacity-50">Your Ad Here — 728×90</span>
    </div>
  );
}

export function AdBannerBottom() {
  return (
    <div className="ad-zone ad-banner-bottom">
      <span className="mt-4 text-xs opacity-50">Your Ad Here — 728×90</span>
    </div>
  );
}

export function AdSidebar() {
  return (
    <div className="ad-zone ad-sidebar">
      <span className="mt-6 text-xs opacity-50 text-center px-2">Your Ad Here<br />300×250</span>
    </div>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--blrd-black)" }}>
      {/* Top Ad Banner */}
      <div className="container pt-2">
        <AdBannerTop />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--blrd-border)",
        }}
      >
        <div className="container">
          <div className="flex items-center h-14 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/blrd-logo_b5e87130.png"
                alt="BLRD Vision Entertainment"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0 ml-4 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${location === link.href ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded transition-colors"
                style={{ color: "var(--blrd-gray)" }}
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span
                    className="hidden sm:flex items-center gap-1 text-xs font-ui"
                    style={{ color: "var(--blrd-gray-light)" }}
                  >
                    <User size={14} />
                    {user?.name || "Member"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border transition-colors font-ui"
                    style={{
                      borderColor: "var(--blrd-border)",
                      color: "var(--blrd-gray)",
                    }}
                  >
                    <LogOut size={12} />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <a
                  href={getLoginUrl()}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded font-ui font-semibold transition-all"
                  style={{
                    background: "var(--blrd-cyan)",
                    color: "var(--blrd-black)",
                    letterSpacing: "0.08em",
                  }}
                >
                  Sign In / Join
                </a>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded"
                style={{ color: "var(--blrd-gray-light)" }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-3">
              <div className="flex gap-2">
                <input
                  type="search"
                  placeholder="Search BLRD..."
                  autoFocus
                  className="flex-1 px-3 py-2 text-sm rounded border outline-none"
                  style={{
                    background: "var(--blrd-dark-2)",
                    borderColor: "var(--blrd-border)",
                    color: "var(--blrd-white)",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                    if (e.key === "Enter") {
                      toast.info("Search feature coming soon!");
                      setSearchOpen(false);
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => toast.info("Search feature coming soon!")}
                  style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)" }}
                >
                  Go
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Nav */}
          {mobileOpen && (
            <nav className="lg:hidden pb-4 border-t pt-3" style={{ borderColor: "var(--blrd-border)" }}>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link block py-2 ${location === link.href ? "active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {showSidebar ? (
          <div className="container py-6">
            <div className="flex gap-6">
              {/* Content */}
              <div className="flex-1 min-w-0">{children}</div>
              {/* Sidebar */}
              <aside className="hidden xl:flex flex-col gap-4 w-[300px] shrink-0">
                <AdSidebar />
                <AdSidebar />
              </aside>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Bottom Ad Banner */}
      <div className="container pb-4">
        <AdBannerBottom />
      </div>

      {/* Footer */}
      <footer
        className="border-t py-10"
        style={{ borderColor: "var(--blrd-border)", background: "var(--blrd-dark)" }}
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663453126583/DEtMGVgfKVDqXRWzhEhATX/blrd-logo_b5e87130.png"
                alt="BLRD"
                className="h-10 w-auto mb-3"
              />
              <p className="text-xs leading-relaxed" style={{ color: "var(--blrd-gray)" }}>
                The authentic voice of diverse geek culture. Gaming, comics, film, TV, and creators — all in one place.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-display font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
                Navigate
              </h4>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs transition-colors hover:text-white font-ui"
                    style={{ color: "var(--blrd-gray)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-xs font-display font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
                Community
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Submit a Blog Post", href: "/blog" },
                  { label: "Rate & Review", href: "/reviews" },
                  { label: "Upcoming Events", href: "/events" },
                  { label: "Discover Content", href: "/discover" },
                  { label: "Contact Us", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs transition-colors hover:text-white font-ui"
                    style={{ color: "var(--blrd-gray)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs font-display font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
                Follow BLRD
              </h4>
              <div className="flex flex-col gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs transition-colors hover:text-white font-ui"
                    style={{ color: "var(--blrd-gray)" }}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t text-xs"
            style={{ borderColor: "var(--blrd-border)", color: "var(--blrd-gray)" }}
          >
            <span className="font-ui">
              © 2025 Blerd Vision Entertainment LLC. All rights reserved. Kansas City, MO.
            </span>
            <div className="flex gap-4 font-ui">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <Link href="/contact" className="hover:text-white transition-colors">Advertise</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
