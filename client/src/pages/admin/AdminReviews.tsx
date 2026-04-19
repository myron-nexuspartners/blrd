import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

type CategoryFilter = "all" | "games" | "tv" | "movies" | "comics" | "music";

const CATEGORY_COLORS: Record<string, string> = {
  games: "var(--blrd-gaming)",
  tv: "var(--blrd-tv)",
  movies: "var(--blrd-film)",
  comics: "var(--blrd-comics)",
  music: "var(--blrd-culture)",
};

function FlameRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Flame
          key={i}
          size={12}
          style={{
            color: i < Math.round(value) ? "var(--blrd-orange)" : "var(--blrd-dark-3)",
            fill: i < Math.round(value) ? "var(--blrd-orange)" : "var(--blrd-dark-3)",
          }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: "var(--blrd-gray)" }}>
        {Number(value).toFixed(1)}
      </span>
    </div>
  );
}

type ReviewFormData = {
  title: string;
  subhead: string;
  body: string;
  imageUrl: string;
  category: "games" | "tv" | "movies" | "comics" | "music";
  releaseYear: string;
  developer: string;
  publisher: string;
  genre: string;
  isFeatured: boolean;
  externalRatings: string;
};

function ReviewFormModal({
  review,
  onClose,
  onSaved,
}: {
  review?: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!review;
  const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: review
      ? {
          title: review.title,
          subhead: review.subhead ?? "",
          body: review.body,
          imageUrl: review.imageUrl ?? "",
          category: review.category,
          releaseYear: review.releaseYear ? String(review.releaseYear) : "",
          developer: review.developer ?? "",
          publisher: review.publisher ?? "",
          genre: review.genre ?? "",
          isFeatured: review.isFeatured,
          externalRatings: review.externalRatings ?? "",
        }
      : { category: "games", isFeatured: false },
  });

  const create = trpc.admin.reviews.create.useMutation({
    onSuccess: () => { toast.success("Review created!"); onSaved(); },
    onError: (e) => toast.error(e.message),
  });

  const update = trpc.admin.reviews.update.useMutation({
    onSuccess: () => { toast.success("Review updated!"); onSaved(); },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = (data: ReviewFormData) => {
    const payload = {
      title: data.title,
      subhead: data.subhead || undefined,
      body: data.body,
      imageUrl: data.imageUrl || undefined,
      category: data.category,
      releaseYear: data.releaseYear ? parseInt(data.releaseYear) : undefined,
      developer: data.developer || undefined,
      publisher: data.publisher || undefined,
      genre: data.genre || undefined,
      isFeatured: data.isFeatured,
      externalRatings: data.externalRatings || undefined,
    };

    if (isEdit) {
      update.mutate({ id: review.id, ...payload });
    } else {
      create.mutate(payload);
    }
  };

  const inputStyle = {
    background: "var(--blrd-dark-3)",
    border: "1px solid var(--blrd-border)",
    color: "var(--blrd-white)",
    borderRadius: "4px",
    padding: "8px 12px",
    fontSize: "13px",
    width: "100%",
    fontFamily: "Metropolis, Inter, sans-serif",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "var(--blrd-gray)",
    marginBottom: "4px",
    fontFamily: "Metropolis, Inter, sans-serif",
  };

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
          <h2 className="font-display font-bold text-base" style={{ color: "var(--blrd-white)" }}>
            {isEdit ? "Edit Review" : "Add New Review"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--blrd-gray)" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label style={labelStyle}>Title *</label>
              <input {...register("title", { required: true })} style={inputStyle} placeholder="Review title" />
              {errors.title && <span className="text-xs text-red-400">Required</span>}
            </div>

            <div className="md:col-span-2">
              <label style={labelStyle}>Subhead</label>
              <input {...register("subhead")} style={inputStyle} placeholder="Short summary or tagline" />
            </div>

            <div>
              <label style={labelStyle}>Category *</label>
              <select {...register("category", { required: true })} style={inputStyle}>
                <option value="games">Games</option>
                <option value="tv">TV</option>
                <option value="movies">Movies</option>
                <option value="comics">Comics</option>
                <option value="music">Music</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Release Year</label>
              <input {...register("releaseYear")} style={inputStyle} placeholder="e.g. 2024" type="number" />
            </div>

            <div>
              <label style={labelStyle}>Developer / Creator</label>
              <input {...register("developer")} style={inputStyle} placeholder="Studio, developer, or creator" />
            </div>

            <div>
              <label style={labelStyle}>Publisher / Network</label>
              <input {...register("publisher")} style={inputStyle} placeholder="Publisher or network" />
            </div>

            <div>
              <label style={labelStyle}>Genre</label>
              <input {...register("genre")} style={inputStyle} placeholder="e.g. RPG, Sci-Fi, Hip-Hop" />
            </div>

            <div>
              <label style={labelStyle}>Image URL</label>
              <input {...register("imageUrl")} style={inputStyle} placeholder="https://..." />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Review Body *</label>
            <textarea
              {...register("body", { required: true })}
              style={{ ...inputStyle, minHeight: "140px", resize: "vertical" }}
              placeholder="Full review content..."
            />
            {errors.body && <span className="text-xs text-red-400">Required</span>}
          </div>

          <div>
            <label style={labelStyle}>External Ratings (JSON)</label>
            <textarea
              {...register("externalRatings")}
              style={{ ...inputStyle, minHeight: "70px", resize: "vertical", fontSize: "11px" }}
              placeholder={`[{"source":"IGN","score":"8/10","url":"https://ign.com/..."}]`}
            />
            <p className="text-xs mt-1" style={{ color: "var(--blrd-gray)" }}>
              JSON array: {"[{\"source\": \"IGN\", \"score\": \"8/10\", \"url\": \"https://...\"}]"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" {...register("isFeatured")} className="w-4 h-4" />
            <label htmlFor="isFeatured" style={{ ...labelStyle, marginBottom: 0 }}>
              Feature this review on the Reviews page
            </label>
          </div>

          <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--blrd-border)" }}>
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="blrd-btn-primary"
            >
              {create.isPending || update.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Review"}
            </button>
            <button type="button" onClick={onClose} className="blrd-btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.reviews.list.useQuery({
    category: categoryFilter,
    page,
    pageSize: 15,
  });

  const deleteMutation = trpc.admin.reviews.delete.useMutation({
    onSuccess: () => {
      toast.success("Review deleted.");
      utils.admin.reviews.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const feature = trpc.admin.reviews.feature.useMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.featured ? "Review featured!" : "Review unfeatured.");
      utils.admin.reviews.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const totalPages = data ? Math.ceil(data.total / 15) : 1;

  const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "games", label: "Games" },
    { id: "tv", label: "TV" },
    { id: "movies", label: "Movies" },
    { id: "comics", label: "Comics" },
    { id: "music", label: "Music" },
  ];

  const handleSaved = () => {
    setShowCreateModal(false);
    setEditingReview(null);
    utils.admin.reviews.list.invalidate();
    utils.admin.stats.invalidate();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: "var(--blrd-white)" }}>
            Review Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--blrd-gray)" }}>
            Add, edit, and manage BLRD reviews across all categories.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="blrd-btn-primary flex items-center gap-2"
        >
          <Plus size={14} /> Add Review
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setCategoryFilter(tab.id); setPage(1); }}
            className="px-3 py-1.5 rounded text-xs font-ui font-bold tracking-wide uppercase transition-all"
            style={{
              background: categoryFilter === tab.id ? "var(--blrd-cyan)" : "var(--blrd-dark-2)",
              color: categoryFilter === tab.id ? "var(--blrd-black)" : "var(--blrd-gray-lighter)",
              border: `1px solid ${categoryFilter === tab.id ? "var(--blrd-cyan)" : "var(--blrd-border)"}`,
              fontFamily: "Metropolis, Inter, sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="rounded overflow-hidden" style={{ border: "1px solid var(--blrd-border)" }}>
        <div
          className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 text-xs font-ui font-bold tracking-widest uppercase"
          style={{
            background: "var(--blrd-dark-3)",
            color: "var(--blrd-gray)",
            borderBottom: "1px solid var(--blrd-border)",
            fontFamily: "Metropolis, Inter, sans-serif",
          }}
        >
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Flames Avg</div>
          <div className="col-span-1">Ratings</div>
          <div className="col-span-1">Year</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center" style={{ color: "var(--blrd-gray)" }}>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "var(--blrd-cyan)" }} />
            Loading reviews...
          </div>
        ) : !data?.items.length ? (
          <div className="p-12 text-center" style={{ color: "var(--blrd-gray)" }}>
            <Flame size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-ui" style={{ fontFamily: "Metropolis, Inter, sans-serif" }}>
              No reviews found. Add your first one!
            </p>
          </div>
        ) : (
          data.items.map((review, idx) => (
            <div
              key={review.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 items-center transition-colors hover:bg-white/[0.02]"
              style={{ borderBottom: idx < data.items.length - 1 ? "1px solid var(--blrd-border)" : "none" }}
            >
              <div className="md:col-span-4">
                <div className="flex items-center gap-2">
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt=""
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div
                      className="text-sm font-semibold line-clamp-1"
                      style={{ color: "var(--blrd-white)", fontFamily: "Metropolis, Inter, sans-serif" }}
                    >
                      {review.title}
                    </div>
                    {review.isFeatured && (
                      <span className="text-xs" style={{ color: "var(--blrd-culture)" }}>★ Featured</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: `${CATEGORY_COLORS[review.category] ?? "var(--blrd-gray)"}18`,
                    color: CATEGORY_COLORS[review.category] ?? "var(--blrd-gray)",
                    border: `1px solid ${CATEGORY_COLORS[review.category] ?? "var(--blrd-gray)"}40`,
                    fontFamily: "Metropolis, Inter, sans-serif",
                  }}
                >
                  {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
                </span>
              </div>

              <div className="md:col-span-2">
                <FlameRating value={Number(review.avgUserRating ?? 0)} />
              </div>

              <div className="md:col-span-1 text-xs" style={{ color: "var(--blrd-gray)" }}>
                {review.totalRatings}
              </div>

              <div className="md:col-span-1 text-xs" style={{ color: "var(--blrd-gray)" }}>
                {review.releaseYear ?? "—"}
              </div>

              <div className="md:col-span-2 flex items-center gap-1.5 md:justify-end">
                <button
                  onClick={() => setEditingReview(review)}
                  title="Edit"
                  className="p-1.5 rounded transition-colors hover:bg-white/10"
                  style={{ color: "var(--blrd-cyan)" }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => feature.mutate({ id: review.id, featured: !review.isFeatured })}
                  title={review.isFeatured ? "Unfeature" : "Feature"}
                  className="p-1.5 rounded transition-colors hover:bg-yellow-500/20"
                  style={{ color: review.isFeatured ? "var(--blrd-culture)" : "var(--blrd-gray)" }}
                >
                  {review.isFeatured ? <Star size={14} /> : <StarOff size={14} />}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this review and all its ratings?")) {
                      deleteMutation.mutate({ id: review.id });
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
            Page {page} of {totalPages} · {data?.total} reviews
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded disabled:opacity-40"
              style={{ background: "var(--blrd-dark-2)", color: "var(--blrd-gray)", border: "1px solid var(--blrd-border)" }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded disabled:opacity-40"
              style={{ background: "var(--blrd-dark-2)", color: "var(--blrd-gray)", border: "1px solid var(--blrd-border)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <ReviewFormModal onClose={() => setShowCreateModal(false)} onSaved={handleSaved} />
      )}
      {editingReview && (
        <ReviewFormModal review={editingReview} onClose={() => setEditingReview(null)} onSaved={handleSaved} />
      )}
    </AdminLayout>
  );
}
