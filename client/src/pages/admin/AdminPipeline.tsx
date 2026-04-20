import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Key, Plus, Ban, CheckCircle, Clock, RefreshCw, Copy, Zap, FileText } from "lucide-react";

const VERTICAL_LABELS: Record<string, string> = {
  "gaming": "Gaming",
  "tv-streaming": "TV / Streaming",
  "music-movies": "Music & Movies",
  "comics-cosplay-anime": "Comics, Cosplay & Anime",
  "technology-culture": "Technology & Culture",
};

const VERTICAL_COLORS: Record<string, string> = {
  "gaming": "bg-[#1BC9C9]/20 text-[#1BC9C9] border-[#1BC9C9]/30",
  "tv-streaming": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "music-movies": "bg-[#FF5722]/20 text-[#FF5722] border-[#FF5722]/30",
  "comics-cosplay-anime": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "technology-culture": "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function AdminPipeline() {
  const utils = trpc.useUtils();
  const { data: tokens, isLoading: tokensLoading } = trpc.pipeline.listTokens.useQuery();
  const { data: draftQueue, isLoading: queueLoading } = trpc.pipeline.draftQueue.useQuery({ limit: 50 });

  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [tokenLabel, setTokenLabel] = useState("");
  const [newToken, setNewToken] = useState<string | null>(null);

  const generateTokenMutation = trpc.pipeline.generateToken.useMutation({
    onSuccess: (data) => {
      setNewToken(data.token);
      utils.pipeline.listTokens.invalidate();
      setTokenLabel("");
    },
    onError: (e) => toast.error(e.message),
  });

  const revokeTokenMutation = trpc.pipeline.revokeToken.useMutation({
    onSuccess: () => {
      toast.success("Token revoked");
      utils.pipeline.listTokens.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
  }

  const activeTokens = (tokens ?? []).filter((t) => t.isActive);
  const revokedTokens = (tokens ?? []).filter((t) => !t.isActive);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-['Metropolis',sans-serif] uppercase tracking-wider">
            Content <span className="text-[#1BC9C9]">Pipeline</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage API tokens and review articles submitted by the Python content agent
          </p>
        </div>
        <Button
          onClick={() => { setNewToken(null); setShowTokenDialog(true); }}
          className="bg-[#1BC9C9] hover:bg-[#1BC9C9]/80 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Generate Token
        </Button>
      </div>

      {/* Pipeline Integration Guide */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-[#1BC9C9] flex items-center gap-2">
            <Zap className="w-4 h-4" /> Python Pipeline Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm mb-3">
            Replace the WordPress publisher in your Python agent with this endpoint. The pipeline will submit articles as drafts for your review.
          </p>
          <div className="bg-black rounded-md p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
            <div className="text-zinc-500 mb-1"># In blerd_content_agent.py — replace publish_to_wordpress()</div>
            <div className="text-[#1BC9C9]">import requests</div>
            <div className="mt-2">
              <span className="text-yellow-400">BLRD_API_URL</span> = <span className="text-green-400">"{window.location.origin}/api/pipeline/articles"</span>
            </div>
            <div>
              <span className="text-yellow-400">BLRD_TOKEN</span> = <span className="text-green-400">"your_token_from_above"</span>
            </div>
            <div className="mt-2">
              <span className="text-blue-400">def</span> <span className="text-[#1BC9C9]">publish_to_blrd</span>(article):
            </div>
            <div className="ml-4">payload = {"{"}</div>
            <div className="ml-8"><span className="text-green-400">"token"</span>: BLRD_TOKEN,</div>
            <div className="ml-8"><span className="text-green-400">"title"</span>: article[<span className="text-green-400">"title"</span>],</div>
            <div className="ml-8"><span className="text-green-400">"excerpt"</span>: article.get(<span className="text-green-400">"excerpt"</span>, <span className="text-green-400">""</span>),</div>
            <div className="ml-8"><span className="text-green-400">"content"</span>: article[<span className="text-green-400">"content"</span>],</div>
            <div className="ml-8"><span className="text-green-400">"vertical"</span>: article.get(<span className="text-green-400">"vertical"</span>),  <span className="text-zinc-500"># e.g. "gaming"</span></div>
            <div className="ml-8"><span className="text-green-400">"author_slug"</span>: article.get(<span className="text-green-400">"author_slug"</span>),  <span className="text-zinc-500"># e.g. "kai-reeves"</span></div>
            <div className="ml-8"><span className="text-green-400">"tags"</span>: article.get(<span className="text-green-400">"tags"</span>, []),</div>
            <div className="ml-8"><span className="text-green-400">"status"</span>: <span className="text-green-400">"draft"</span>,</div>
            <div className="ml-4">{"}"}</div>
            <div className="ml-4">r = requests.post(BLRD_API_URL, json=payload, timeout=30)</div>
            <div className="ml-4">r.raise_for_status()</div>
            <div className="ml-4"><span className="text-blue-400">return</span> r.json()</div>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[
              { slug: "kai-reeves", vertical: "gaming" },
              { slug: "amara-desta", vertical: "tv-streaming" },
              { slug: "sol-carter", vertical: "music-movies" },
              { slug: "noor-bensalem", vertical: "comics-cosplay-anime" },
              { slug: "taye-adeyemi", vertical: "technology-culture" },
            ].map((a) => (
              <div key={a.slug} className={`rounded px-2 py-1.5 border text-center ${VERTICAL_COLORS[a.vertical] ?? ""}`}>
                <div className="font-bold">{a.slug}</div>
                <div className="opacity-70 text-[10px]">{VERTICAL_LABELS[a.vertical]}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Tokens */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 font-['Metropolis',sans-serif] uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-[#1BC9C9]" /> API Tokens
        </h2>
        {tokensLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-zinc-900 rounded animate-pulse" />)}
          </div>
        ) : activeTokens.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 border border-zinc-800 rounded-lg">
            <Key className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No active tokens. Generate one to connect your Python pipeline.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTokens.map((token) => (
              <div key={token.id} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{token.label}</span>
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                    <span className="font-mono">{token.token.slice(0, 12)}...{token.token.slice(-6)}</span>
                    {token.lastUsedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last used {new Date(token.lastUsedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-zinc-400 hover:text-[#1BC9C9]"
                    onClick={() => copyToClipboard(token.token)}
                    title="Copy token"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-zinc-400 hover:text-red-400"
                    onClick={() => {
                      if (confirm("Revoke this token? The pipeline will stop working until a new token is configured.")) {
                        revokeTokenMutation.mutate({ id: token.id });
                      }
                    }}
                    title="Revoke token"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {revokedTokens.length > 0 && (
          <details className="mt-3">
            <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-300">
              {revokedTokens.length} revoked token(s)
            </summary>
            <div className="space-y-1 mt-2">
              {revokedTokens.map((token) => (
                <div key={token.id} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded p-2 opacity-50">
                  <Ban className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="text-zinc-400 text-sm">{token.label}</span>
                  <span className="text-zinc-600 text-xs font-mono ml-auto">{token.token.slice(0, 8)}...</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      <Separator className="bg-zinc-800" />

      {/* Draft Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white font-['Metropolis',sans-serif] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF5722]" /> Pipeline Draft Queue
          </h2>
          <Button
            size="sm"
            variant="ghost"
            className="text-zinc-400 hover:text-white"
            onClick={() => utils.pipeline.draftQueue.invalidate()}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>

        {queueLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-zinc-900 rounded animate-pulse" />)}
          </div>
        ) : !draftQueue || draftQueue.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 border border-zinc-800 rounded-lg">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No pipeline articles yet</p>
            <p className="text-sm mt-1">Articles submitted by the Python agent will appear here for review.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {draftQueue.map((article) => (
              <div key={article.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {article.vertical && (
                        <Badge className={`text-xs border ${VERTICAL_COLORS[article.vertical] ?? "bg-zinc-700 text-zinc-300"}`}>
                          {VERTICAL_LABELS[article.vertical] ?? article.vertical}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          article.status === "draft"
                            ? "border-zinc-600 text-zinc-400"
                            : "border-yellow-500/30 text-yellow-400"
                        }`}
                      >
                        {article.status}
                      </Badge>
                      <span className="text-zinc-600 text-xs">
                        {new Date(article.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-snug">{article.title}</h3>
                    {article.subhead && (
                      <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{article.subhead}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                      {article.authorName && <span>By {article.authorName}</span>}
                      <span>{article.body.length} chars</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Token Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={(open) => { setShowTokenDialog(open); if (!open) setNewToken(null); }}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle className="font-['Metropolis',sans-serif] text-[#1BC9C9]">
              Generate Pipeline Token
            </DialogTitle>
          </DialogHeader>

          {newToken ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 text-sm font-semibold mb-2">✓ Token generated successfully</p>
                <p className="text-zinc-400 text-xs mb-3">
                  Copy this token now — it will not be shown again.
                </p>
                <div className="flex items-center gap-2 bg-black rounded p-3">
                  <code className="text-[#1BC9C9] text-xs font-mono flex-1 break-all">{newToken}</code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-zinc-400 hover:text-[#1BC9C9] shrink-0"
                    onClick={() => copyToClipboard(newToken)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-zinc-500 text-xs">
                Add this token to your Python script as <code className="text-[#1BC9C9]">BLRD_TOKEN</code>.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Token Label</label>
                <Input
                  value={tokenLabel}
                  onChange={(e) => setTokenLabel(e.target.value)}
                  placeholder="e.g. Python Content Agent v1"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <p className="text-zinc-500 text-xs mt-1">A descriptive name to identify this token.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            {newToken ? (
              <Button
                onClick={() => { setShowTokenDialog(false); setNewToken(null); }}
                className="bg-[#1BC9C9] hover:bg-[#1BC9C9]/80 text-black font-bold"
              >
                Done
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowTokenDialog(false)} className="text-zinc-400">
                  Cancel
                </Button>
                <Button
                  onClick={() => generateTokenMutation.mutate({ label: tokenLabel || "Pipeline Token" })}
                  disabled={generateTokenMutation.isPending}
                  className="bg-[#1BC9C9] hover:bg-[#1BC9C9]/80 text-black font-bold"
                >
                  Generate Token
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
