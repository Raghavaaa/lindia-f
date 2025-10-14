"use client";
import { useState } from "react";

interface Props {
  userId?: string;
  onClose?: () => void;
}

export default function ResearchModal({ userId, onClose }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setResult(String(data.result ?? ""));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
        <h3 className="text-lg font-semibold mb-2">Research</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your research question..."
            className="w-full min-h-28 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10">Close</button>
            <button disabled={loading || !text.trim()} className="px-4 py-2 rounded-xl text-sm font-medium bg-black text-white disabled:opacity-60">
              {loading ? "Running..." : "Run Research"}
            </button>
          </div>
        </form>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        {result && (
          <div className="mt-4 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 whitespace-pre-wrap text-sm">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}


