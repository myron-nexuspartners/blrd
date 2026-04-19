import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

type StatusFilter = "all" | "new" | "read" | "replied";

const INQUIRY_COLORS: Record<string, string> = {
  partnership: "var(--blrd-cyan)",
  advertising: "var(--blrd-orange)",
  press: "var(--blrd-culture)",
  community: "var(--blrd-tv)",
  general: "var(--blrd-gray)",
};

const STATUS_COLORS: Record<string, string> = {
  new: "var(--blrd-orange)",
  read: "var(--blrd-gray-lighter)",
  replied: "var(--blrd-tv)",
};

function ContactDetailModal({
  contact,
  onClose,
  onStatusChange,
}: {
  contact: any;
  onClose: () => void;
  onStatusChange: (id: number, status: "new" | "read" | "replied") => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded"
        style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
      >
        <div className="flex items-start justify-between p-4" style={{ borderBottom: "1px solid var(--blrd-border)" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  background: `${INQUIRY_COLORS[contact.inquiryType] ?? "var(--blrd-gray)"}18`,
                  color: INQUIRY_COLORS[contact.inquiryType] ?? "var(--blrd-gray)",
                  border: `1px solid ${INQUIRY_COLORS[contact.inquiryType] ?? "var(--blrd-gray)"}40`,
                  fontFamily: "Metropolis, Inter, sans-serif",
                }}
              >
                {contact.inquiryType}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  background: `${STATUS_COLORS[contact.status] ?? "var(--blrd-gray)"}18`,
                  color: STATUS_COLORS[contact.status] ?? "var(--blrd-gray)",
                  border: `1px solid ${STATUS_COLORS[contact.status] ?? "var(--blrd-gray)"}40`,
                  fontFamily: "Metropolis, Inter, sans-serif",
                }}
              >
                {contact.status}
              </span>
            </div>
            <h2 className="font-display font-bold text-base" style={{ color: "var(--blrd-white)" }}>
              {contact.name}
            </h2>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm"
              style={{ color: "var(--blrd-cyan)" }}
            >
              {contact.email}
            </a>
          </div>
          <button onClick={onClose} style={{ color: "var(--blrd-gray)" }}><X size={18} /></button>
        </div>

        {contact.subject && (
          <div className="px-4 pt-3">
            <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--blrd-gray)", fontFamily: "Metropolis, Inter, sans-serif" }}>
              Subject
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--blrd-gray-lighter)", fontFamily: "Metropolis, Inter, sans-serif" }}>
              {contact.subject}
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--blrd-gray)", fontFamily: "Metropolis, Inter, sans-serif" }}>
            Message
          </div>
          <div
            className="text-sm leading-relaxed whitespace-pre-wrap rounded p-3"
            style={{
              color: "var(--blrd-gray-light)",
              background: "var(--blrd-dark-3)",
              border: "1px solid var(--blrd-border)",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: "Metropolis, Inter, sans-serif",
            }}
          >
            {contact.message}
          </div>
          <div className="text-xs mt-2" style={{ color: "var(--blrd-gray)" }}>
            Received {format(new Date(contact.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </div>
        </div>

        <div className="flex gap-2 p-4 flex-wrap" style={{ borderTop: "1px solid var(--blrd-border)" }}>
          <a
            href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || "Your BLRD inquiry")}`}
            onClick={() => onStatusChange(contact.id, "replied")}
            className="blrd-btn-primary flex items-center gap-2 text-sm"
          >
            <Mail size={13} /> Reply via Email
          </a>
          {contact.status !== "read" && (
            <button
              onClick={() => { onStatusChange(contact.id, "read"); onClose(); }}
              className="blrd-btn-secondary flex items-center gap-2 text-sm"
            >
              <CheckCheck size={13} /> Mark as Read
            </button>
          )}
          {contact.status !== "replied" && (
            <button
              onClick={() => { onStatusChange(contact.id, "replied"); onClose(); }}
              className="blrd-btn-secondary flex items-center gap-2 text-sm"
            >
              <MessageSquare size={13} /> Mark Replied
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminContacts() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("new");
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.admin.contacts.list.useQuery({
    status: statusFilter,
    page,
    pageSize: 20,
  });

  const updateStatus = trpc.admin.contacts.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.contacts.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success("Contact deleted.");
      utils.admin.contacts.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  const STATUS_TABS: { id: StatusFilter; label: string }[] = [
    { id: "new", label: "New" },
    { id: "read", label: "Read" },
    { id: "replied", label: "Replied" },
    { id: "all", label: "All" },
  ];

  const handleStatusChange = (id: number, status: "new" | "read" | "replied") => {
    updateStatus.mutate({ id, status });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: "var(--blrd-white)" }}>
            Contact Submissions
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--blrd-gray)" }}>
            Review and respond to partnership, advertising, press, and community inquiries.
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

      {/* Contacts Table */}
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
          <div className="col-span-3">Name / Email</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-4">Subject / Preview</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center" style={{ color: "var(--blrd-gray)" }}>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: "var(--blrd-cyan)" }} />
            Loading...
          </div>
        ) : !data?.items.length ? (
          <div className="p-12 text-center" style={{ color: "var(--blrd-gray)" }}>
            <Inbox size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-ui" style={{ fontFamily: "Metropolis, Inter, sans-serif" }}>
              No {statusFilter === "all" ? "" : statusFilter} contacts.
            </p>
          </div>
        ) : (
          data.items.map((contact, idx) => (
            <div
              key={contact.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 items-center transition-colors hover:bg-white/[0.02] cursor-pointer"
              style={{
                borderBottom: idx < data.items.length - 1 ? "1px solid var(--blrd-border)" : "none",
                borderLeft: contact.status === "new" ? "2px solid var(--blrd-orange)" : "2px solid transparent",
              }}
              onClick={() => {
                setSelectedContact(contact);
                if (contact.status === "new") handleStatusChange(contact.id, "read");
              }}
            >
              {/* Name / Email */}
              <div className="md:col-span-3">
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--blrd-white)", fontFamily: "Metropolis, Inter, sans-serif" }}
                >
                  {contact.name}
                </div>
                <div className="text-xs" style={{ color: "var(--blrd-cyan)" }}>{contact.email}</div>
              </div>

              {/* Inquiry Type */}
              <div className="md:col-span-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: `${INQUIRY_COLORS[contact.inquiryType] ?? "var(--blrd-gray)"}18`,
                    color: INQUIRY_COLORS[contact.inquiryType] ?? "var(--blrd-gray)",
                    border: `1px solid ${INQUIRY_COLORS[contact.inquiryType] ?? "var(--blrd-gray)"}40`,
                    fontFamily: "Metropolis, Inter, sans-serif",
                  }}
                >
                  {contact.inquiryType}
                </span>
              </div>

              {/* Subject / Preview */}
              <div className="md:col-span-4">
                {contact.subject && (
                  <div
                    className="text-sm font-semibold line-clamp-1"
                    style={{ color: "var(--blrd-gray-lighter)", fontFamily: "Metropolis, Inter, sans-serif" }}
                  >
                    {contact.subject}
                  </div>
                )}
                <div className="text-xs line-clamp-1" style={{ color: "var(--blrd-gray)" }}>
                  {contact.message.slice(0, 80)}...
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-1 text-xs" style={{ color: "var(--blrd-gray)" }}>
                {format(new Date(contact.createdAt), "MMM d")}
              </div>

              {/* Actions */}
              <div
                className="md:col-span-2 flex items-center gap-1.5 md:justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: `${STATUS_COLORS[contact.status] ?? "var(--blrd-gray)"}18`,
                    color: STATUS_COLORS[contact.status] ?? "var(--blrd-gray)",
                    border: `1px solid ${STATUS_COLORS[contact.status] ?? "var(--blrd-gray)"}40`,
                    fontFamily: "Metropolis, Inter, sans-serif",
                  }}
                >
                  {contact.status}
                </span>
                <button
                  onClick={() => {
                    if (confirm("Delete this contact submission?")) {
                      deleteMutation.mutate({ id: contact.id });
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
            Page {page} of {totalPages}
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

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminLayout>
  );
}
