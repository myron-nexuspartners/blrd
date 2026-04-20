import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Twitter, Pen, User } from "lucide-react";

const VERTICAL_OPTIONS = [
  { value: "gaming", label: "Gaming" },
  { value: "tv-streaming", label: "TV / Streaming" },
  { value: "music-movies", label: "Music & Movies" },
  { value: "comics-cosplay-anime", label: "Comics, Cosplay & Anime" },
  { value: "technology-culture", label: "Technology & Culture" },
  { value: "editorial", label: "Editorial" },
];

const VERTICAL_COLORS: Record<string, string> = {
  "gaming": "bg-[#1BC9C9]/20 text-[#1BC9C9] border-[#1BC9C9]/30",
  "tv-streaming": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "music-movies": "bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30",
  "comics-cosplay-anime": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "technology-culture": "bg-green-500/20 text-green-400 border-green-500/30",
  "editorial": "bg-white/20 text-white border-white/30",
};

type Author = {
  id: number;
  slug: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  shortBio?: string | null;
  avatarUrl?: string | null;
  vertical: string;
  twitterHandle?: string | null;
  isActive: boolean;
  articleCount: number;
};

type AuthorForm = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  shortBio: string;
  avatarUrl: string;
  vertical: string;
  twitterHandle: string;
};

const EMPTY_FORM: AuthorForm = {
  slug: "", name: "", title: "", bio: "", shortBio: "",
  avatarUrl: "", vertical: "gaming", twitterHandle: "",
};

export default function AdminAuthors() {
  const utils = trpc.useUtils();
  const { data: authorsList, isLoading } = trpc.authors.list.useQuery();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AuthorForm>(EMPTY_FORM);

  const createMutation = trpc.authors.create.useMutation({
    onSuccess: () => {
      toast.success("Author created");
      utils.authors.list.invalidate();
      setShowDialog(false);
      setForm(EMPTY_FORM);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.authors.update.useMutation({
    onSuccess: () => {
      toast.success("Author updated");
      utils.authors.list.invalidate();
      setShowDialog(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.authors.delete.useMutation({
    onSuccess: () => {
      toast.success("Author deleted");
      utils.authors.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowDialog(true);
  }

  function openEdit(author: Author) {
    setEditingId(author.id);
    setForm({
      slug: author.slug,
      name: author.name,
      title: author.title ?? "",
      bio: author.bio ?? "",
      shortBio: author.shortBio ?? "",
      avatarUrl: author.avatarUrl ?? "",
      vertical: author.vertical,
      twitterHandle: author.twitterHandle ?? "",
    });
    setShowDialog(true);
  }

  function handleSubmit() {
    if (!form.name || !form.slug || !form.vertical) {
      toast.error("Name, slug, and vertical are required");
      return;
    }
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: form.name,
        title: form.title || undefined,
        bio: form.bio || undefined,
        shortBio: form.shortBio || undefined,
        avatarUrl: form.avatarUrl || undefined,
        vertical: form.vertical as "gaming" | "tv-streaming" | "music-movies" | "comics-cosplay-anime" | "technology-culture" | "editorial",
        twitterHandle: form.twitterHandle || undefined,
      });
    } else {
      createMutation.mutate({
        slug: form.slug,
        name: form.name,
        title: form.title || undefined,
        bio: form.bio || undefined,
        shortBio: form.shortBio || undefined,
        avatarUrl: form.avatarUrl || undefined,
        vertical: form.vertical as "gaming" | "tv-streaming" | "music-movies" | "comics-cosplay-anime" | "technology-culture" | "editorial",
        twitterHandle: form.twitterHandle || undefined,
      });
    }
  }

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-['Metropolis',sans-serif] uppercase tracking-wider">
            Beat <span className="text-[#1BC9C9]">Writers</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage author profiles and beat assignments</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#1BC9C9] hover:bg-[#1BC9C9]/80 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Author
        </Button>
      </div>

      {/* Authors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-36 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(authorsList ?? []).map((author) => (
            <Card key={author.id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1BC9C9] to-[#FF5722] flex items-center justify-center flex-shrink-0 text-black font-bold text-lg font-['Metropolis',sans-serif]">
                    {initials(author.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white font-['Metropolis',sans-serif]">{author.name}</h3>
                        {author.title && <p className="text-zinc-400 text-xs">{author.title}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-zinc-400 hover:text-[#1BC9C9]"
                          onClick={() => openEdit(author)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-zinc-400 hover:text-red-400"
                          onClick={() => {
                            if (confirm(`Delete ${author.name}?`)) deleteMutation.mutate({ id: author.id });
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={`text-xs border ${VERTICAL_COLORS[author.vertical] ?? "bg-zinc-700 text-zinc-300"}`}>
                        {VERTICAL_OPTIONS.find(v => v.value === author.vertical)?.label ?? author.vertical}
                      </Badge>
                      <span className="text-zinc-500 text-xs flex items-center gap-1">
                        <Pen className="w-3 h-3" /> {author.articleCount}
                      </span>
                      {author.twitterHandle && (
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Twitter className="w-3 h-3" /> {author.twitterHandle}
                        </span>
                      )}
                      <span className={`text-xs ${author.isActive ? "text-green-400" : "text-red-400"}`}>
                        {author.isActive ? "● Active" : "○ Inactive"}
                      </span>
                    </div>
                    {author.shortBio && (
                      <p className="text-zinc-500 text-xs mt-2 line-clamp-2">{author.shortBio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Metropolis',sans-serif] text-[#1BC9C9]">
              {editingId ? "Edit Author" : "Add Author"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Kai Reeves"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Slug *</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="kai-reeves"
                  disabled={!!editingId}
                  className="bg-zinc-800 border-zinc-700 text-white disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Gaming Beat Writer, BLRD"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Vertical *</label>
              <Select value={form.vertical} onValueChange={(v) => setForm({ ...form, vertical: v })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {VERTICAL_OPTIONS.map((v) => (
                    <SelectItem key={v.value} value={v.value} className="text-white hover:bg-zinc-700">
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Short Bio (card preview)</label>
              <Textarea
                value={form.shortBio}
                onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
                placeholder="One-line description for cards..."
                rows={2}
                className="bg-zinc-800 border-zinc-700 text-white resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Full Bio</label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Full author biography..."
                rows={4}
                className="bg-zinc-800 border-zinc-700 text-white resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Twitter Handle</label>
                <Input
                  value={form.twitterHandle}
                  onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })}
                  placeholder="@handle"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Avatar URL</label>
                <Input
                  value={form.avatarUrl}
                  onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)} className="text-zinc-400">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-[#1BC9C9] hover:bg-[#1BC9C9]/80 text-black font-bold"
            >
              {editingId ? "Save Changes" : "Create Author"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
