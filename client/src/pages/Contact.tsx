import { useState } from "react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Handshake, Newspaper, Users, MessageSquare, Twitter, Instagram, Youtube, Twitch } from "lucide-react";

const INQUIRY_TYPES = [
  {
    id: "partnership",
    label: "Partnership & Advertising",
    icon: <Handshake size={18} />,
    color: "var(--blrd-cyan)",
    description: "Brand partnerships, sponsored content, advertising placements, and co-marketing opportunities.",
  },
  {
    id: "press",
    label: "Press & Media",
    icon: <Newspaper size={18} />,
    color: "var(--blrd-amber)",
    description: "Press inquiries, interview requests, media kits, and editorial collaboration.",
  },
  {
    id: "community",
    label: "Community Submissions",
    icon: <Users size={18} />,
    color: "var(--blrd-cyan)",
    description: "Event submissions, creator spotlights, community news tips, and content suggestions.",
  },
  {
    id: "general",
    label: "General Inquiry",
    icon: <MessageSquare size={18} />,
    color: "var(--blrd-gray-light)",
    description: "General questions, feedback, and everything else.",
  },
];

const SOCIAL_LINKS = [
  {
    name: "Twitter / X",
    handle: "@BlerdVision",
    url: "https://twitter.com/BlerdVision",
    icon: <Twitter size={20} />,
    color: "#1DA1F2",
  },
  {
    name: "Instagram",
    handle: "@BlerdVision",
    url: "https://instagram.com/BlerdVision",
    icon: <Instagram size={20} />,
    color: "#E1306C",
  },
  {
    name: "YouTube",
    handle: "Blerd Vision Entertainment",
    url: "https://youtube.com/@BlerdVision",
    icon: <Youtube size={20} />,
    color: "#FF0000",
  },
  {
    name: "Twitch",
    handle: "BlerdVision",
    url: "https://twitch.tv/BlerdVision",
    icon: <Twitch size={20} />,
    color: "#9146FF",
  },
];

export default function Contact() {
  const [selectedType, setSelectedType] = useState("general");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon. 🔥");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate({
      name: form.name,
      email: form.email,
      subject: form.subject || undefined,
      message: form.message,
      inquiryType: selectedType as any,
    });
  };

  const inputStyle = {
    background: "var(--blrd-dark-3)",
    borderColor: "var(--blrd-border)",
    color: "var(--blrd-white)",
    outline: "none",
  };

  const selectedTypeData = INQUIRY_TYPES.find((t) => t.id === selectedType)!;

  return (
    <Layout showSidebar={false}>
      {/* Header */}
      <div
        className="py-12 border-b"
        style={{
          borderColor: "var(--blrd-border)",
          background: "linear-gradient(135deg, rgba(27,201,201,0.08) 0%, rgba(0,0,0,1) 60%)",
        }}
      >
        <div className="container">
          <span className="blrd-tag blrd-tag-creators mb-3 inline-block">Contact</span>
          <h1
            className="font-display font-black mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--blrd-white)" }}
          >
            Get in Touch
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--blrd-gray-light)" }}>
            Whether you're a brand looking to connect with our community, a journalist covering geek culture, or a fan with something to share — we want to hear from you.
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div
                className="rounded p-10 text-center"
                style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
              >
                <div className="text-5xl mb-4">🔥</div>
                <h2 className="font-display font-bold text-xl mb-3" style={{ color: "var(--blrd-white)" }}>
                  Message Received!
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--blrd-gray-light)" }}>
                  Thanks for reaching out. Our team will review your message and respond within 2–3 business days.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="px-5 py-2.5 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110"
                  style={{ background: "var(--blrd-cyan)", color: "var(--blrd-black)", letterSpacing: "0.08em" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div
                className="rounded p-6"
                style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
              >
                {/* Inquiry Type Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-display font-bold mb-3 tracking-widest uppercase" style={{ color: "var(--blrd-cyan)" }}>
                    What's This About?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INQUIRY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className="flex items-start gap-3 p-3 rounded border text-left transition-all"
                        style={{
                          background: selectedType === type.id ? `${type.color}15` : "var(--blrd-dark-3)",
                          borderColor: selectedType === type.id ? type.color : "var(--blrd-border)",
                        }}
                      >
                        <span style={{ color: type.color, marginTop: "2px" }}>{type.icon}</span>
                        <div>
                          <div
                            className="text-xs font-ui font-semibold mb-0.5"
                            style={{ color: selectedType === type.id ? type.color : "var(--blrd-white)" }}
                          >
                            {type.label}
                          </div>
                          <div className="text-xs leading-relaxed" style={{ color: "var(--blrd-gray)" }}>
                            {type.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-gray)" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="First and last name"
                        className="w-full px-3 py-2.5 text-sm rounded border"
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-gray)" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 text-sm rounded border"
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-gray)" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={
                        selectedType === "partnership"
                          ? "e.g., Sponsored Content Inquiry — Q3 2025"
                          : selectedType === "press"
                          ? "e.g., Interview Request — BLRD Coverage"
                          : selectedType === "community"
                          ? "e.g., Event Submission — BlerdCon 2025"
                          : "Brief subject line..."
                      }
                      className="w-full px-3 py-2.5 text-sm rounded border"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-display font-bold mb-1.5 tracking-widest uppercase" style={{ color: "var(--blrd-gray)" }}>
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={
                        selectedType === "partnership"
                          ? "Tell us about your brand, campaign goals, target audience, and budget range..."
                          : selectedType === "press"
                          ? "Tell us about your publication, the story you're working on, and your deadline..."
                          : selectedType === "community"
                          ? "Share the details of your event, creator, or community news tip..."
                          : "What's on your mind?"
                      }
                      rows={6}
                      className="w-full px-3 py-2.5 text-sm rounded border resize-y"
                      style={inputStyle}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="flex items-center justify-center gap-2 py-3 rounded font-ui font-bold text-sm tracking-wider transition-all hover:brightness-110 disabled:opacity-50"
                    style={{
                      background: selectedTypeData.color,
                      color: selectedType === "general" ? "var(--blrd-dark)" : "var(--blrd-black)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    <Mail size={15} />
                    {submitMutation.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right: Social + Info */}
          <div className="flex flex-col gap-5">
            {/* Response Time */}
            <div
              className="rounded p-4"
              style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
            >
              <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--blrd-cyan)" }}>
                Response Times
              </h3>
              <div className="flex flex-col gap-2 text-xs font-ui" style={{ color: "var(--blrd-gray-light)" }}>
                <div className="flex justify-between">
                  <span>Partnership / Advertising</span>
                  <span style={{ color: "var(--blrd-cyan)" }}>1–2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>Press Inquiries</span>
                  <span style={{ color: "var(--blrd-amber)" }}>Same day</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Submissions</span>
                  <span style={{ color: "var(--blrd-cyan)" }}>3–5 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>General</span>
                  <span style={{ color: "var(--blrd-gray)" }}>3–5 business days</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="rounded p-4"
              style={{ background: "var(--blrd-dark-2)", border: "1px solid var(--blrd-border)" }}
            >
              <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--blrd-white)" }}>
                Follow BLRD
              </h3>
              <div className="flex flex-col gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded border transition-all hover:brightness-110 group"
                    style={{ background: "var(--blrd-dark-3)", borderColor: "var(--blrd-border)" }}
                  >
                    <span style={{ color: s.color }}>{s.icon}</span>
                    <div>
                      <div className="text-xs font-ui font-semibold" style={{ color: "var(--blrd-white)" }}>
                        {s.name}
                      </div>
                      <div className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>
                        {s.handle}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Media Kit */}
            <div
              className="rounded p-4"
              style={{
                background: "linear-gradient(135deg, rgba(27,201,201,0.08) 0%, rgba(0,0,0,1) 100%)",
                border: "1px solid rgba(27,201,201,0.2)",
              }}
            >
              <h3 className="font-display text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--blrd-amber)" }}>
                Media Kit
              </h3>
              <p className="text-xs mb-3" style={{ color: "var(--blrd-gray-light)" }}>
                Press and brand partners can request our media kit including audience demographics, ad specs, and rate cards.
              </p>
              <button
                onClick={() => {
                  setSelectedType("press");
                  setForm({ ...form, subject: "Media Kit Request" });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full py-2 rounded font-ui font-bold text-xs tracking-wider transition-all hover:brightness-110"
                style={{ background: "var(--blrd-amber)", color: "var(--blrd-black)", letterSpacing: "0.08em" }}
              >
                Request Media Kit →
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
