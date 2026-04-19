import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PenLine, Lock, Clock, MessageSquare, User } from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1, category: "gaming", tag: "gaming",
    title: "Why I Finally Gave Elden Ring Another Chance — And Why It Changed My Relationship with Difficulty",
    subhead: "After rage-quitting twice, I came back with a different mindset. Here's what I learned about myself and the game.",
    author: "Marcus T.", authorRole: "Community Member",
    timeAgo: "2 days ago", readTime: "8 min read", comments: 34,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    excerpt: "I'll be honest: I quit Elden Ring twice. The first time was at Margit. The second time was at Godrick. I told myself it wasn't for me — that I was too busy, too casual, that FromSoftware games were gatekeeping masquerading as design philosophy...",
    featured: true,
  },
  {
    id: 2, category: "culture", tag: "culture",
    title: "Being Black at Anime Conventions: The Joy, the Awkwardness, and the Community I Found",
    subhead: "A personal essay about navigating predominantly white geek spaces and finding your people anyway.",
    author: "Simone H.", authorRole: "Community Member",
    timeAgo: "4 days ago", readTime: "12 min read", comments: 89,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    excerpt: "The first time I walked into an anime convention, I was 16 and I was terrified. Not because of the crowds — I'd been to concerts before — but because I could count the number of Black people I saw on one hand...",
    featured: true,
  },
  {
    id: 3, category: "comics", tag: "comics",
    title: "The Case for Reading Comics Out of Order: A Contrarian's Guide to Marvel",
    subhead: "Forget continuity. Here's why jumping in wherever interests you is actually the right move.",
    author: "Devon K.", authorRole: "Community Member",
    timeAgo: "1 week ago", readTime: "6 min read", comments: 22,
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&q=80",
    excerpt: "Every time someone asks me how to get into comics, I watch their eyes glaze over when I mention continuity. 'Do I need to read 60 years of back issues?' No. Absolutely not. Here's my controversial take...",
    featured: false,
  },
  {
    id: 4, category: "film", tag: "film",
    title: "Afrofuturism Isn't a Genre — It's a Lens, and Here's Why That Distinction Matters",
    subhead: "A critical look at how we talk about Black speculative fiction and why the framing shapes the conversation.",
    author: "Jordan P.", authorRole: "Community Member",
    timeAgo: "1 week ago", readTime: "10 min read", comments: 47,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    excerpt: "When Black Panther came out in 2018, every think-piece called it an 'Afrofuturist film.' And while that's not wrong, the label started doing something interesting — it began to feel like a box...",
    featured: false,
  },
  {
    id: 5, category: "gaming", tag: "gaming",
    title: "I Spent 200 Hours in Baldur's Gate 3 and Here's What I Learned About Myself",
    subhead: "A long-form reflection on choice, consequence, and what RPGs reveal about our values.",
    author: "Keisha D.", authorRole: "Community Member",
    timeAgo: "2 weeks ago", readTime: "15 min read", comments: 63,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    excerpt: "I've played a lot of RPGs. I've made a lot of choices in fictional worlds. But nothing prepared me for the moment in Baldur's Gate 3 when I had to decide whether to...",
    featured: false,
  },
  {
    id: 6, category: "creators", tag: "creators",
    title: "How I Built a 10K Gaming Community from Zero — Without Going Viral",
    subhead: "Slow growth, genuine connection, and the long game of community building.",
    author: "TechBlerdie", authorRole: "Community Member",
    timeAgo: "2 weeks ago", readTime: "9 min read", comments: 38,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    excerpt: "Everyone wants to go viral. I get it. But after two years of building my gaming community, I've learned that the most valuable growth is the kind that happens slowly...",
    featured: false,
  },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "gaming", label: "Gaming" },
  { id: "film", label: "Movies" },
  { id: "tv", label: "TV" },
  { id: "comics", label: "Comics" },
  { id: "tech", label: "Tech" },
  { id: "culture", label: "Culture" },
  { id: "creators", label: "Creators" },
];

function BlogCard({ post, large = false }: { post: typeof BLOG_POSTS[0]; large?: boolean }) {
  if (large) {
    return (
      <div className="blrd-card group overflow-hidden cursor-pointer">
        <div className="h-52 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`blrd-tag blrd-tag-${post.tag}`}>{post.category}</span>
            <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
              {post.timeAgo} · {post.readTime}
            </span>
          </div>
          <h2
            className="font-semibold text-base leading-snug mb-2 transition-colors group-hover:text-cyan-400"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
          >
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--blrd-gray)" }}>
            {post.subhead}
          </p>
          <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--blrd-gray-light)" }}>
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--blrd-gray)" }}>
            <span className="flex items-center gap-1 font-ui">
              <User size={11} /> {post.author}
            </span>
            <span className="flex items-center gap-1 font-ui">
              <MessageSquare size={11} /> {post.comments}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blrd-card flex gap-3 p-3 group cursor-pointer">
      <div className="w-24 h-20 shrink-0 rounded overflow-hidden bg-gray-800">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`blrd-tag blrd-tag-${post.tag}`}>{post.category}</span>
          <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>{post.timeAgo}</span>
        </div>
        <h3
          className="text-sm font-semibold leading-snug mb-1 line-clamp-2 transition-colors group-hover:text-cyan-400"
          style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}
        >
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--blrd-gray)" }}>
          <span className="font-ui">{post.author}</span>
          <span>💬 {post.comments}</span>
          <span className="ml-auto">{post.readTime}</span>
        </div>
      </div>
    </div>
  );
}

function SubmitPostForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    subhead: "",
    body: "",
    category: "gaming" as const,
  });

  const submitMutation = trpc.blog.submit.useMutation({
    onSuccess: () => {
      toast.success("Your post has been submitted for review! We'll publish it soon. 🔥");
      setForm({ title: "", subhead: "", body: "", category: "gaming" });
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    submitMutation.mutate({
      title: form.title,
      subhead: form.subhead || undefined,
      body: form.body,
      category: form.category,
    });
  };

  const inputStyle = {
    background: "var(--blrd-dark-3)",
    borderColor: "var(--blrd-border)",
    color: "var(--blrd-white)",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
          Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Your compelling headline..."
          className="w-full px-3 py-2.5 text-sm rounded border"
          style={inputStyle}
          required
          maxLength={255}
        />
      </div>

      <div>
        <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
          Subheadline
        </label>
        <input
          type="text"
          value={form.subhead}
          onChange={(e) => setForm({ ...form, subhead: e.target.value })}
          placeholder="A brief description of your post..."
          className="w-full px-3 py-2.5 text-sm rounded border"
          style={inputStyle}
          maxLength={500}
        />
      </div>

      <div>
        <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
          Category *
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as any })}
          className="w-full px-3 py-2.5 text-sm rounded border"
          style={inputStyle}
        >
          {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
          Your Post *
        </label>
        <textarea
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Share your thoughts, opinions, and stories with the BLRD community..."
          rows={10}
          className="w-full px-3 py-2.5 text-sm rounded border resize-y"
          style={inputStyle}
          required
          minLength={50}
        />
        <div className="text-xs mt-1 text-right font-ui" style={{ color: "var(--blrd-gray)" }}>
          {form.body.length} characters (min 50)
        </div>
      </div>

      <div
        className="rounded p-3 text-xs"
        style={{ background: "rgba(27,201,201,0.08)", border: "1px solid rgba(27,201,201,0.2)", color: "var(--blrd-gray-light)" }}
      >
        <strong style={{ color: "var(--blrd-amber)" }}>Submission Guidelines:</strong> Posts are reviewed by the BLRD team before publishing. Keep it respectful, original, and on-topic. No spam, hate speech, or plagiarism. We reserve the right to edit for clarity.
      </div>

      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="py-3 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110 disabled:opacity-50"
        style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.1em" }}
      >
        {submitMutation.isPending ? "Submitting..." : "Submit Post for Review 🔥"}
      </button>
    </form>
  );
}

export default function Blog() {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const filtered =
    activeCategory === "all"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-xl font-bold mb-1" style={{ color: "var(--blrd-white)" }}>
              Community Blog
            </h1>
            <p className="text-sm" style={{ color: "var(--blrd-gray)" }}>
              Opinion pieces, personal essays, and community voices from BLRD members.
            </p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                window.location.href = getLoginUrl();
                return;
              }
              setShowSubmitForm(!showSubmitForm);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110 shrink-0"
            style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.08em" }}
          >
            <PenLine size={14} />
            Write a Post
          </button>
        </div>
      </div>

      {/* Submit Form */}
      {showSubmitForm && (
        <div
          className="rounded p-6 mb-6"
          style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
              Submit a Blog Post
            </h2>
            <button
              onClick={() => setShowSubmitForm(false)}
              className="text-xs font-ui"
              style={{ color: "var(--blrd-gray)" }}
            >
              ✕ Close
            </button>
          </div>
          {isAuthenticated ? (
            <SubmitPostForm onSuccess={() => setShowSubmitForm(false)} />
          ) : (
            <div className="text-center py-8">
              <Lock size={32} className="mx-auto mb-3" style={{ color: "var(--blrd-gray)" }} />
              <p className="text-sm mb-4" style={{ color: "var(--blrd-gray-light)" }}>
                You need to be signed in to submit a blog post.
              </p>
              <a
                href={getLoginUrl()}
                className="px-5 py-2.5 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110 inline-block"
                style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.08em" }}
              >
                Sign In to Continue
              </a>
            </div>
          )}
        </div>
      )}

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-3 py-1.5 text-xs rounded border transition-all font-ui font-semibold tracking-wide"
            style={{
              background: activeCategory === cat.id ? "var(--blrd-cyan)" : "var(--blrd-dark-2)",
              borderColor: activeCategory === cat.id ? "var(--blrd-cyan)" : "var(--blrd-border)",
              color: activeCategory === cat.id ? "var(--blrd-black)" : "var(--blrd-gray-light)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Posts */}
      {featured.length > 0 && (
        <div className="mb-6">
          <div className="section-header">
            <h2>Featured Posts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featured.map((p) => (
              <BlogCard key={p.id} post={p} large />
            ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div>
        <div className="section-header">
          <h2>Community Voices</h2>
          <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>{filtered.length} posts</span>
        </div>
        <div className="flex flex-col gap-3">
          {(featured.length > 0 ? rest : filtered).map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>

      {/* Write CTA */}
      {!showSubmitForm && (
        <div
          className="mt-8 rounded p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(27,201,201,0.08) 0%, rgba(0,0,0,1) 100%)",
            border: "1px solid rgba(27,201,201,0.2)",
          }}
        >
          <h3 className="font-display font-bold mb-2 text-sm" style={{ color: "var(--blrd-white)" }}>
            Have Something to Say?
          </h3>
          <p className="text-xs mb-4 max-w-sm mx-auto" style={{ color: "var(--blrd-gray)" }}>
            The BLRD community blog is your platform. Share your opinions, reviews, essays, and stories with thousands of fellow geek culture enthusiasts.
          </p>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                window.location.href = getLoginUrl();
                return;
              }
              setShowSubmitForm(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110 mx-auto"
            style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.08em" }}
          >
            <PenLine size={14} />
            {isAuthenticated ? "Write a Post" : "Sign In to Write"}
          </button>
        </div>
      )}
    </Layout>
  );
}
