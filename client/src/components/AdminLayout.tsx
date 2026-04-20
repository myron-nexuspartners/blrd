import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Star,
  Users,
  Zap,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/contacts", label: "Contacts", icon: Inbox },
  { href: "/admin/authors", label: "Beat Writers", icon: Users },
  { href: "/admin/pipeline", label: "Pipeline", icon: Zap },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  badge,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  const [location] = useLocation();
  const isActive = exact ? location === href : location.startsWith(href);

  return (
    <Link href={href} onClick={onClick}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded transition-all cursor-pointer group"
        style={{
          background: isActive ? "rgba(27,201,201,0.12)" : "transparent",
          borderLeft: isActive ? "2px solid var(--blrd-cyan)" : "2px solid transparent",
          color: isActive ? "var(--blrd-cyan)" : "var(--blrd-gray-lighter)",
        }}
      >
        <Icon size={16} />
        <span
          className="text-sm font-ui font-semibold tracking-wide"
          style={{ fontFamily: "Metropolis, Inter, sans-serif" }}
        >
          {label}
        </span>
        {badge !== undefined && badge > 0 && (
          <span
            className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: "var(--blrd-orange)", color: "var(--blrd-white)", minWidth: "20px", textAlign: "center" }}
          >
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Signed out");
      window.location.href = "/";
    },
  });

  const stats = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    refetchInterval: 30000,
  });

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--blrd-black)" }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "var(--blrd-cyan)" }}
          />
          <p className="text-sm font-ui" style={{ color: "var(--blrd-gray)" }}>
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--blrd-black)" }}
      >
        <div
          className="text-center p-8 rounded max-w-sm w-full"
          style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
        >
          <Shield size={40} className="mx-auto mb-4" style={{ color: "var(--blrd-cyan)" }} />
          <h2 className="font-display font-bold text-lg mb-2" style={{ color: "var(--blrd-white)" }}>
            Admin Access Required
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--blrd-gray)" }}>
            Please sign in to access the BLRD Admin Dashboard.
          </p>
          <a href={getLoginUrl()} className="blrd-btn-primary w-full justify-center">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--blrd-black)" }}
      >
        <div
          className="text-center p-8 rounded max-w-sm w-full"
          style={{ background: "var(--blrd-dark-2)", border: "1px solid rgba(255,87,34,0.3)" }}
        >
          <Shield size={40} className="mx-auto mb-4" style={{ color: "var(--blrd-orange)" }} />
          <h2 className="font-display font-bold text-lg mb-2" style={{ color: "var(--blrd-white)" }}>
            Access Denied
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--blrd-gray)" }}>
            You don't have admin privileges. Contact the site owner to request access.
          </p>
          <Link href="/">
            <button className="blrd-btn-primary w-full justify-center">Back to BLRD</button>
          </Link>
        </div>
      </div>
    );
  }

  const pendingBadge = stats.data?.pendingBlogPosts ?? 0;
  const newContactBadge = stats.data?.newContacts ?? 0;

  const Sidebar = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full" style={{ background: "var(--blrd-dark-2)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: "1px solid var(--blrd-border)" }}
      >
        <div className="flex items-center gap-2">
          <Shield size={18} style={{ color: "var(--blrd-cyan)" }} />
          <div>
            <div
              className="text-xs font-display font-bold tracking-widest uppercase"
              style={{ color: "var(--blrd-cyan)" }}
            >
              BLRD Admin
            </div>
            <div className="text-xs" style={{ color: "var(--blrd-gray)", fontFamily: "Metropolis, Inter, sans-serif" }}>
              {user.name || user.email}
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: "var(--blrd-gray)" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            badge={
              item.href === "/admin/blog"
                ? pendingBadge
                : item.href === "/admin/contacts"
                ? newContactBadge
                : undefined
            }
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid var(--blrd-border)" }}>
        <Link href="/" onClick={onClose}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded transition-all cursor-pointer mb-1"
            style={{ color: "var(--blrd-gray)" }}
          >
            <ChevronRight size={16} />
            <span className="text-sm font-ui" style={{ fontFamily: "Metropolis, Inter, sans-serif" }}>
              Back to Site
            </span>
          </div>
        </Link>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 px-3 py-2.5 rounded transition-all w-full text-left"
          style={{ color: "var(--blrd-gray)" }}
        >
          <LogOut size={16} />
          <span className="text-sm font-ui" style={{ fontFamily: "Metropolis, Inter, sans-serif" }}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--blrd-black)" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen"
        style={{ borderRight: "1px solid var(--blrd-border)" }}
      >
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
          style={{
            background: "var(--blrd-dark-2)",
            borderBottom: "1px solid var(--blrd-border)",
          }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ color: "var(--blrd-gray)" }}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: "var(--blrd-cyan)" }} />
            <span
              className="text-sm font-display font-bold tracking-widest uppercase"
              style={{ color: "var(--blrd-cyan)" }}
            >
              BLRD Admin
            </span>
          </div>
          {pendingBadge > 0 && (
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--blrd-orange)", color: "var(--blrd-white)" }}
            >
              {pendingBadge} pending
            </span>
          )}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
