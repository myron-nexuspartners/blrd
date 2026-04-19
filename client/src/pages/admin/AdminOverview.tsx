import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  Calendar,
  Inbox,
  Star,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
  href,
  alert,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
  href?: string;
  alert?: boolean;
}) {
  const card = (
    <div
      className="blrd-card p-5 flex items-start gap-4 transition-all"
      style={alert ? { borderColor: "var(--blrd-orange)", boxShadow: "0 0 12px rgba(255,87,34,0.15)" } : {}}
    >
      <div
        className="w-10 h-10 rounded flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}40` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div
          className="text-2xl font-display font-bold"
          style={{ color: alert ? "var(--blrd-orange)" : "var(--blrd-white)" }}
        >
          {value}
        </div>
        <div className="text-xs font-ui font-semibold tracking-wide uppercase mt-0.5" style={{ color: "var(--blrd-gray)" }}>
          {label}
        </div>
        {sub && (
          <div className="text-xs mt-1" style={{ color: "var(--blrd-gray)" }}>
            {sub}
          </div>
        )}
      </div>
      {alert && (
        <AlertCircle size={16} className="ml-auto shrink-0" style={{ color: "var(--blrd-orange)" }} />
      )}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

const QUICK_ACTIONS = [
  { label: "Add New Event", href: "/admin/events?action=new", icon: Calendar, color: "var(--blrd-tv)" },
  { label: "Add New Review", href: "/admin/reviews?action=new", icon: Star, color: "var(--blrd-cyan)" },
  { label: "Review Blog Queue", href: "/admin/blog", icon: BookOpen, color: "var(--blrd-orange)" },
  { label: "View Contacts", href: "/admin/contacts", icon: Inbox, color: "var(--blrd-film)" },
];

export default function AdminOverview() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="font-display font-bold text-xl tracking-wide"
          style={{ color: "var(--blrd-white)" }}
        >
          Dashboard Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--blrd-gray)" }}>
          Welcome back. Here's what's happening across BLRD.
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="blrd-card p-5 h-24 animate-pulse"
              style={{ background: "var(--blrd-dark-3)" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Pending Blog Posts"
            value={stats?.pendingBlogPosts ?? 0}
            icon={BookOpen}
            color="var(--blrd-orange)"
            sub="Awaiting approval"
            href="/admin/blog"
            alert={(stats?.pendingBlogPosts ?? 0) > 0}
          />
          <StatCard
            label="Total Blog Posts"
            value={stats?.totalBlogPosts ?? 0}
            icon={BookOpen}
            color="var(--blrd-cyan)"
            sub="Published + pending"
            href="/admin/blog"
          />
          <StatCard
            label="Reviews"
            value={stats?.totalReviews ?? 0}
            icon={Star}
            color="var(--blrd-culture)"
            sub="Across all categories"
            href="/admin/reviews"
          />
          <StatCard
            label="Active Events"
            value={stats?.totalEvents ?? 0}
            icon={Calendar}
            color="var(--blrd-tv)"
            sub="Live & upcoming"
            href="/admin/events"
          />
          <StatCard
            label="New Contacts"
            value={stats?.newContacts ?? 0}
            icon={Inbox}
            color="var(--blrd-film)"
            sub="Unread inquiries"
            href="/admin/contacts"
            alert={(stats?.newContacts ?? 0) > 0}
          />
          <StatCard
            label="Total Ratings"
            value={stats?.totalRatings ?? 0}
            icon={TrendingUp}
            color="var(--blrd-cyan)"
            sub="Community Flames cast"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="section-header mb-4">
          <h2>Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className="blrd-card p-4 flex flex-col items-center gap-2 text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{ background: `${action.color}18`, border: `1px solid ${action.color}40` }}
                >
                  <action.icon size={18} style={{ color: action.color }} />
                </div>
                <span
                  className="text-xs font-ui font-semibold"
                  style={{ color: "var(--blrd-gray-lighter)", fontFamily: "Metropolis, Inter, sans-serif" }}
                >
                  {action.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div>
        <div className="section-header mb-4">
          <h2>System Status</h2>
        </div>
        <div
          className="rounded p-4 space-y-3"
          style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
        >
          {[
            { label: "Database connection", ok: true },
            { label: "Auth system (Manus OAuth)", ok: true },
            { label: "Ad zones configured", ok: false, note: "Connect ad network" },
            { label: "Email notifications", ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              {item.ok ? (
                <CheckCircle2 size={14} style={{ color: "var(--blrd-tv)" }} />
              ) : (
                <AlertCircle size={14} style={{ color: "var(--blrd-orange)" }} />
              )}
              <span className="text-sm font-ui" style={{ color: "var(--blrd-gray-lighter)", fontFamily: "Metropolis, Inter, sans-serif" }}>
                {item.label}
              </span>
              {item.note && (
                <span className="text-xs ml-auto" style={{ color: "var(--blrd-orange)" }}>
                  {item.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
