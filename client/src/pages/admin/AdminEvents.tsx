import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  ExternalLink,
  MousePointerClick,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useSearch } from "wouter";

const EVENT_TYPE_COLORS: Record<string, string> = {
  convention: "var(--blrd-cyan)",
  tournament: "var(--blrd-gaming)",
  panel: "var(--blrd-culture)",
  screening: "var(--blrd-film)",
  workshop: "var(--blrd-tv)",
  "watch-party": "var(--blrd-comics)",
  virtual: "var(--blrd-gray-lighter)",
  other: "var(--blrd-gray)",
};

type EventFormData = {
  name: string;
  description: string;
  imageUrl: string;
  eventType: "convention" | "tournament" | "panel" | "screening" | "workshop" | "watch-party" | "virtual" | "other";
  category: "gaming" | "comics" | "film" | "tv" | "tech" | "culture" | "multi";
  location: string;
  isVirtual: boolean;
  registrationUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

function EventFormModal({
  event,
  onClose,
  onSaved,
}: {
  event?: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!event;
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    defaultValues: event
      ? {
          name: event.name,
          description: event.description ?? "",
          imageUrl: event.imageUrl ?? "",
          eventType: event.eventType,
          category: event.category,
          location: event.location ?? "",
          isVirtual: event.isVirtual,
          registrationUrl: event.registrationUrl ?? "",
          startDate: event.startDate
            ? format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm")
            : "",
          endDate: event.endDate
            ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm")
            : "",
          isActive: event.isActive,
        }
      : { eventType: "convention", category: "gaming", isVirtual: false, isActive: true },
  });

  const create = trpc.admin.events.create.useMutation({
    onSuccess: () => { toast.success("Event created!"); onSaved(); },
    onError: (e) => toast.error(e.message),
  });

  const update = trpc.admin.events.update.useMutation({
    onSuccess: () => { toast.success("Event updated!"); onSaved(); },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = (data: EventFormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
      eventType: data.eventType,
      category: data.category,
      location: data.location || undefined,
      isVirtual: data.isVirtual,
      registrationUrl: data.registrationUrl || undefined,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      isActive: data.isActive,
    };

    if (isEdit) {
      update.mutate({ id: event.id, ...payload });
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
            {isEdit ? "Edit Event" : "Add New Event"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--blrd-gray)" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label style={labelStyle}>Event Name *</label>
              <input {...register("name", { required: true })} style={inputStyle} placeholder="Event name" />
              {errors.name && <span className="text-xs text-red-400">Required</span>}
            </div>

            <div>
              <label style={labelStyle}>Event Type *</label>
              <select {...register("eventType", { required: true })} style={inputStyle}>
                <option value="convention">Convention</option>
                <option value="tournament">Tournament</option>
                <option value="panel">Panel</option>
                <option value="screening">Screening</option>
                <option value="workshop">Workshop</option>
                <option value="watch-party">Watch Party</option>
                <option value="virtual">Virtual</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Category *</label>
              <select {...register("category", { required: true })} style={inputStyle}>
                <option value="gaming">Gaming</option>
                <option value="comics">Comics</option>
                <option value="film">Film</option>
                <option value="tv">TV</option>
                <option value="tech">Tech</option>
                <option value="culture">Culture</option>
                <option value="multi">Multi / All</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Start Date & Time *</label>
              <input
                {...register("startDate", { required: true })}
                type="datetime-local"
                style={inputStyle}
              />
              {errors.startDate && <span className="text-xs text-red-400">Required</span>}
            </div>

            <div>
              <label style={labelStyle}>End Date & Time</label>
              <input {...register("endDate")} type="datetime-local" style={inputStyle} />
            </div>

            <div className="md:col-span-2">
              <label style={labelStyle}>Location</label>
              <input {...register("location")} style={inputStyle} placeholder="City, State or 'Online'" />
            </div>

            <div className="md:col-span-2">
              <label style={labelStyle}>Registration / Ticket URL</label>
              <input {...register("registrationUrl")} style={inputStyle} placeholder="https://..." />
              <p className="text-xs mt-1" style={{ color: "var(--blrd-gray)" }}>
                UTM tracking params will be appended automatically for monetization.
              </p>
            </div>

            <div className="md:col-span-2">
              <label style={labelStyle}>Image URL</label>
              <input {...register("imageUrl")} style={inputStyle} placeholder="https://..." />
            </div>

            <div className="md:col-span-2">
              <label style={labelStyle}>Description</label>
              <textarea
                {...register("description")}
                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                placeholder="Event description..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isVirtual" {...register("isVirtual")} className="w-4 h-4" />
              <label htmlFor="isVirtual" style={{ ...labelStyle, marginBottom: 0 }}>Virtual Event</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4" />
              <label htmlFor="isActive" style={{ ...labelStyle, marginBottom: 0 }}>Active (visible on site)</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid var(--blrd-border)" }}>
            <button
              type="submit"
              disabled={create.isPending || update.isPending}
              className="blrd-btn-primary"
            >
              {create.isPending || update.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Event"}
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

export default function AdminEvents() {
  const [page, setPage] = useState(1);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const utils = trpc.useUtils();
  const search = useSearch();

  // Auto-open create modal if ?action=new in URL
  useEffect(() => {
    if (search.includes("action=new")) {
      setShowCreateModal(true);
    }
  }, [search]);

  const { data, isLoading } = trpc.admin.events.list.useQuery({
    page,
    pageSize: 15,
    includeInactive: true,
  });

  const deleteMutation = trpc.admin.events.delete.useMutation({
    onSuccess: () => {
      toast.success("Event deleted.");
      utils.admin.events.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const toggleActive = trpc.admin.events.toggleActive.useMutation({
    onSuccess: (_, vars) => {
      toast.success(vars.isActive ? "Event activated." : "Event deactivated.");
      utils.admin.events.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const totalPages = data ? Math.ceil(data.total / 15) : 1;

  const handleSaved = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    utils.admin.events.list.invalidate();
    utils.admin.stats.invalidate();
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: "var(--blrd-white)" }}>
            Event Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--blrd-gray)" }}>
            Add, edit, and manage BLRD events. Registration links are auto-tracked with UTM params.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="blrd-btn-primary flex items-center gap-2"
        >
          <Plus size={14} /> Add Event
        </button>
      </div>

      {/* Events Table */}
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
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Type / Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-1">Clicks</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center" style={{ color: "var(--blrd-gray)" }}>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "var(--blrd-cyan)" }} />
            Loading events...
          </div>
        ) : !data?.items.length ? (
          <div className="p-12 text-center" style={{ color: "var(--blrd-gray)" }}>
            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-ui" style={{ fontFamily: "Metropolis, Inter, sans-serif" }}>
              No events yet. Add your first event!
            </p>
          </div>
        ) : (
          data.items.map((event, idx) => (
            <div
              key={event.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 items-center transition-colors hover:bg-white/[0.02]"
              style={{
                borderBottom: idx < data.items.length - 1 ? "1px solid var(--blrd-border)" : "none",
                opacity: event.isActive ? 1 : 0.55,
              }}
            >
              {/* Name */}
              <div className="md:col-span-3">
                <div
                  className="text-sm font-semibold line-clamp-1"
                  style={{ color: "var(--blrd-white)", fontFamily: "Metropolis, Inter, sans-serif" }}
                >
                  {event.name}
                </div>
                {event.registrationUrl && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <ExternalLink size={10} style={{ color: "var(--blrd-cyan)" }} />
                    <span className="text-xs line-clamp-1" style={{ color: "var(--blrd-cyan)" }}>
                      Reg link set
                    </span>
                  </div>
                )}
              </div>

              {/* Type / Category */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded inline-block w-fit"
                  style={{
                    background: `${EVENT_TYPE_COLORS[event.eventType] ?? "var(--blrd-gray)"}18`,
                    color: EVENT_TYPE_COLORS[event.eventType] ?? "var(--blrd-gray)",
                    border: `1px solid ${EVENT_TYPE_COLORS[event.eventType] ?? "var(--blrd-gray)"}40`,
                    fontFamily: "Metropolis, Inter, sans-serif",
                  }}
                >
                  {event.eventType}
                </span>
                <span className="text-xs" style={{ color: "var(--blrd-gray)" }}>{event.category}</span>
              </div>

              {/* Date */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--blrd-gray-lighter)" }}>
                  <Calendar size={11} />
                  {format(new Date(event.startDate), "MMM d, yyyy")}
                </div>
                {event.endDate && (
                  <div className="text-xs mt-0.5" style={{ color: "var(--blrd-gray)" }}>
                    → {format(new Date(event.endDate), "MMM d")}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--blrd-gray)" }}>
                  <MapPin size={11} />
                  <span className="line-clamp-1">{event.isVirtual ? "Virtual" : event.location || "TBD"}</span>
                </div>
              </div>

              {/* Clicks */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--blrd-cyan)" }}>
                  <MousePointerClick size={11} />
                  {event.clickCount}
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-1">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: event.isActive ? "rgba(27,201,201,0.12)" : "rgba(255,255,255,0.05)",
                    color: event.isActive ? "var(--blrd-cyan)" : "var(--blrd-gray)",
                    border: `1px solid ${event.isActive ? "rgba(27,201,201,0.3)" : "var(--blrd-border)"}`,
                    fontFamily: "Metropolis, Inter, sans-serif",
                  }}
                >
                  {event.isActive ? "Active" : "Hidden"}
                </span>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex items-center gap-1.5 md:justify-end">
                <button
                  onClick={() => setEditingEvent(event)}
                  title="Edit"
                  className="p-1.5 rounded transition-colors hover:bg-white/10"
                  style={{ color: "var(--blrd-cyan)" }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => toggleActive.mutate({ id: event.id, isActive: !event.isActive })}
                  title={event.isActive ? "Deactivate" : "Activate"}
                  className="p-1.5 rounded transition-colors hover:bg-white/10"
                  style={{ color: event.isActive ? "var(--blrd-tv)" : "var(--blrd-gray)" }}
                >
                  {event.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this event permanently?")) {
                      deleteMutation.mutate({ id: event.id });
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
            Page {page} of {totalPages} · {data?.total} events
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
        <EventFormModal onClose={() => setShowCreateModal(false)} onSaved={handleSaved} />
      )}
      {editingEvent && (
        <EventFormModal event={editingEvent} onClose={() => setEditingEvent(null)} onSaved={handleSaved} />
      )}
    </AdminLayout>
  );
}
