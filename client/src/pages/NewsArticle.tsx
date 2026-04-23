import { useEffect } from "react";
import { Link, useParams } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Clock, Eye } from "lucide-react";


function readTime(body: string) {
  const words = (body ?? "").split(/s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}


function categoryLabel(cat: string) {
  const MAP: Record<string, string> = {
    gaming: "Gaming", film: "Movies", tv: "TV", comics: "Comics",
    tech: "Tech", culture: "Culture", events: "Events", creators: "Creators",
  };
  return MAP[cat] ?? cat;
}


function formatBody(body: string) {
  const NL = String.fromCharCode(10);
  return body
    .split(NL + NL)
    .map((para, i) => (
      <p
        key={i}
        className="leading-relaxed mb-4 text-base"
        style={{ color: "var(--blrd-gray-light)" }}
        dangerouslySetInnerHTML={{
          __html: para
            .split(NL).join("<br/>")
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>"),
        }}
      />
    ));
}/).map((para, i) => (
    <p key={i} className="leading-relaxed mb-4 text-base"
      style={{ color: "var(--blrd-gray-light)" }}
      dangerouslySetInnerHTML={{
        __html: para
          .replace(/
/g, "<br/>")
          .replace(/**(.+?)**/g, "<strong>$1</strong>")
          .replace(/*(.+?)*/g, "<em>$1</em>"),
      }} />
  ));
}


function RelatedCard({ article }: { article: any }) {
  const mins = Math.max(1, Math.round((article.body ?? "").split(/s+/).length / 200));
  const image = article.imageUrl ?? "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=70";
  return (
    <Link href={`/news/${article.slug}`}>
      <div className="blrd-card flex gap-3 p-3 group cursor-pointer">
        <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-800">
          <img src={image} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`blrd-tag blrd-tag-${article.category} mb-1 inline-block`}>{categoryLabel(article.category)}</span>
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-cyan-400"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--blrd-white)" }}>
            {article.title}
          </h4>
          <span className="text-xs font-ui" style={{ color: "var(--blrd-gray)" }}>{mins} min read</span>
        </div>
      </div>
    </Link>
  );
}


export default function NewsArticle() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: article, isLoading, isError } = trpc.articles.bySlug.useQuery(
    { slug }, { enabled: !!slug, staleTime: 60_000 }
  );
  const viewMutation = trpc.articles.view.useMutation();
  useEffect(() => {
