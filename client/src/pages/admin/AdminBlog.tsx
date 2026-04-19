import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Check,
  X,
  Trash2,
  Star,
  StarOff,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

type StatusFilter = "all" | "pending" | "published" | "draft";

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--blrd-orange)",
  published: "var(--blrd-tv)",
  draft: "var(--blrd-gray)",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  published: CheckCircle2,
  draft: XCircle,
};

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICONS[status] ?? FileText;
  const color = STATUS_COLORS[status] ?? "var(--blrd-gray)";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-ui font-bold px-2 py-0.5 rounded"
      style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
    >
      <Icon size={10} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PostDetailModal({
  post,
  onClose,
  onApprove,
  onReject,
}: {
  post: { id: number; title: string; subhead?: string | null; body: string; authorName?: string | null; category: string; status: string; createdAt: Date };
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded"
        style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--blrd-border)" }}>
          <div>
            <StatusBadge status={post.status} />
            <h2 className="font-display font-bold text-base mt-2" style={{ color: "var(--blrd-white)" }}>
              {post.title}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--blrd-gray)" }}>
              <span>By {post.authorName || "Anonymous"}</span>
              <span>·</span>
              <span className={`blrd-tag blrd-tag-${post.category}`}>{post.category}</span>
              <span>·</span>
              <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--blrd-gray)" }}>
            <X size={18} />
          </button>
        </div>

        {post.subhead && (
          <div className="px-4 pt-4">
            <p className="text-sm font-semibold" style={{ color: "var(--blrd-gray-lighter)", fontFamily: "Metropolis, Inter, sans-serif" }}>
              {post.subhead}
            </p>
          </div>
        )}

        <div className="p-4">
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap rounded p-4"
            style={{
              color: "var(--blrd-gray-light)",
              background: "var(--blrd-dark-3)",
              border: "1px solid var(--blrd-border)",
              maxHeight: "300px",
              overflowY: "auto",
              fontFamily: "Metropolis, Inter, sans-serif",
            }}
          >
            {post.body}
          </div>
        </div>

        {post.status === "pending" && (
          <div className="flex gap-3 p-4" style={{ borderTop: "1px solid var(--blrd-border)" }}>
            <button
              onClick={() => { onApprove(post.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-ui font-bold transition-all hover:brightness-110"
              style={{ background: "var(--blrd-tv)", color: "var(--blrd-black)", fontFamily: "Metropolis, Inter, sans-serif" }}
            >
              <Check size={14} /> Approve & Publish
            </button>
            <button
              onClick={() => { onReject(post.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-ui font-bold transition-all hover:brightness-110"
              style={{ background: "rgba(255,87,34,0.15)", color: "var(--blrd-orange)", border: "1px solid rgba(255,87,34,0.3)", fontFamily: "Metropolis, Inter, sans-serif" }}
            >
              <X size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.blog.list.useQuery({
    status: statusFilter,
    page,
    pageSize: 15,
  });

  const approve = trpc.admin.blog.approve.useMutation({
    onSuccess: () => {
      toast.success("Post approved and published!");
      utils.admin.blog.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const reject = trpc.admin.blog.reject.useMutation({
    onSuccess: () => {
      toast.success("Post rejected and moved to draft.");
      utils.admin.blog.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted.");
      utils.admin.blog.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const feature = trpc.admin.blog.feature.useMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.featured ? "Post featured!" : "Post unfeatured.");
      utils.admin.blog.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const totalPages = data ? Math.ceil(data.total / 15) : 1;

  const STATUS_TABS: { id: StatusFilter; label: string }[] = [
    { id: "pending", label: "Pending" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Rejected / Draft" },
    { id: "all", label: "All" },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: "var(--blrd-white)" }}>
            Blog Post Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--blrd-gray)" }}>
            Review, approve, or reject community-submitted blog posts.
          </p>
        </div>
        {data && (
          <div
            className="text-sm font-ui font-semibold px-3 py-1.5 rounded"
            style={{ background: "var(--blrd-dark-2)", color: "var(--blrd-gray)", border: "1px solid var(--blrd-border)", fontFamily: "Metropolis, Inter, sans-serif" }}
          >
            {data.total} total
          </div>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setStatusFilter(tab.id); setPage(1); }}
            className="px-3 py-1.5 rounded text-xs font-ui font-bold tracking-wide uppercase transition-all"
            style={{
              background: statusFilter === tab.id ? "var(--blrd-cyan)" : "var(--blrd-dark-2)",
              color: statusFilter === tab.id ? "var(--blrd-black)" : "var(--blrd-gray-lighter)",
              border: `1px solid ${statusFilter === tab.id ? "var(--blrd-cyan)" : "var(--blrd-border)"}`,
              fontFamily: "Metropolis, Inter, sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      <div
        className="rounded overflow-hidden"
        style={{ border: "1px solid var(--blrd-border)" }}
      >
        {/* Table Header */}
        <div
          className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 text-xs font-ui font-bold tracking-widest uppercase"
          style={{
            background: "var(--blrd-dark-3)",
            color: "var(--blrd-gray)",
            borderBottom: "1px solid var(--blrd-border)",
            fontFamily: "Metropolis, Inter, sans-serif",
          }}
        >
          <div className="col-span-5">Title / Author</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center" style={{ color: "var(--blrd-gray)" }}>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "var(--blrd-cyan)" }} />
            Loading posts...
          </div>
        ) : !data?.items.length ? (
          <div className="p-12 text-center" style={{ color: "var(--blrd-gray)" }}>
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-ui" style={{ fontFamily: "Metropolis, Inter, sans-serif" }}>
              No {statusFilter === "all" ? "" : statusFilter} posts found.
            </p>
          </div>
        ) : (
          data.items.map((post, idx) => (
            <div
              key={post.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 items-center transition-colors hover:bg-white/[0.02]"
              style={{
                borderBottom: idx < data.items.length - 1 ? "1px solid var(--blrd-border)" : "none",
              }}
            >
              {/* Title / Author */}
              <div className="md:col-span-5">
                <div
                  className="text-sm font-semibold line-clamp-1"
                  style={{ color: "var(--blrd-white)", fontFamily: "Metropolis, Inter, sans-serif" }}
                >
                  {post.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--blrd-gray)" }}>
                  By {post.authorName || "Anonymous"}
                </div>
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <span className={`blrd-tag blrd-tag-${post.category}`}>{post.category}</span>
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <StatusBadge status={post.status} />
              </div>

              {/* Date */}
              <div className="md:col-span-1 text-xs" style={{ color: "var(--blrd-gray)" }}>
                {format(new Date(post.createdAt), "MMM d")}
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex items-center gap-1.5 md:justify-end flex-wrap">
                <button
                  onClick={() => setSelectedPost(post)}
                  title="Preview"
                  className="p-1.5 rounded transition-colors hover:bg-white/10"
                  style={{ color: "var(--blrd-gray)" }}
                >
                  <Eye size={14} />
                </button>

                {post.status === "pending" && (
                  <>
                    <button
                      onClick={() => approve.mutate({ id: post.id })}
                      title="Approve"
                      disabled={approve.isPending}
                      className="p-1.5 rounded transition-colors hover:bg-green-500/20"
                      style={{ color: "var(--blrd-tv)" }}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => reject.mutate({ id: post.id })}
                      title="Reject"
                      disabled={reject.isPending}
                      className="p-1.5 rounded transition-colors hover:bg-orange-500/20"
                      style={{ color: "var(--blrd-orange)" }}
                    >
                      <X size={14} />
                    </button>
                  </>
                )}

                {post.status === "published" && (
                  <button
                    onClick={() => feature.mutate({ id: post.id, featured: !post.isFeatured })}
                    title={post.isFeatured ? "Unfeature" : "Feature"}
                    className="p-1.5 rounded transition-colors hover:bg-yellow-500/20"
                    style={{ color: post.isFeatured ? "var(--blrd-culture)" : "var(--blrd-gray)" }}
                  >
                    {post.isFeatured ? <Star size={14} /> : <StarOff size={14} />}
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm("Delete this post permanently?")) {
                      deleteMutation.mutate({ id: post.id });
                    }
                  }}
                  title="Delete"
                  disabled={deleteMutation.isPending}
                  className="p-1.5 rounded transition-colors hover:bg-red-500/20"
                  style={{ color: "var(--blrd-gray)" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)", fontFamily: "Metropolis, Inter, sans-serif" }}>
            Page {page} of {totalPages} · {data?.total} posts
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded transition-colors disabled:opacity-40"
              style={{ background: "var(--blrd-dark-2)", color: "var(--blrd-gray)", border: "1px solid var(--blrd-border)" }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded transition-colors disabled:opacity-40"
              style={{ background: "var(--blrd-dark-2)", color: "var(--blrd-gray)", border: "1px solid var(--blrd-border)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onApprove={(id) => approve.mutate({ id })}
          onReject={(id) => reject.mutate({ id })}
        />
      )}
    </AdminLayout>
  );
}
