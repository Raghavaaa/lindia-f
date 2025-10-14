"use client";
import { useState, useRef, useEffect } from "react";

interface Props {
  userId?: string;
  onClose?: () => void;
}

export default function ResearchModal({ userId, onClose }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const scrollToTopRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom when result updates
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (resultRef.current && scrollToTopRef.current) {
        const { scrollTop } = resultRef.current;
        const showButton = scrollTop > 100;
        scrollToTopRef.current.style.display = showButton ? "block" : "none";
      }
    };

    const resultElement = resultRef.current;
    if (resultElement) {
      resultElement.addEventListener("scroll", handleScroll);
      return () => resultElement.removeEventListener("scroll", handleScroll);
    }
  }, [result]);

  const scrollToTop = () => {
    if (resultRef.current) {
      resultRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
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

  async function handleSaveResearch() {
    if (!result || !text) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: text, 
          userId, 
          save: true,
          result: result 
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save research:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl h-[80vh] rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 animate-in zoom-in-95 duration-200 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Enter your research query</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 flex-shrink-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: My property was encroached by seller — what legal remedy do I have?"
            className="w-full min-h-32 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 px-3 py-2 text-sm resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10">Close</button>
            <button disabled={loading || !text.trim()} className="px-4 py-2 rounded-xl text-sm font-medium bg-black text-white disabled:opacity-60">
              {loading ? "Running..." : "Run Research"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          </div>
        )}

        {result && (
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Research Output</h4>
              <button
                onClick={handleSaveResearch}
                disabled={saving || saved}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-green-600 text-white disabled:opacity-60 hover:bg-green-700 transition-colors"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save Research"}
              </button>
            </div>
            
            <div 
              ref={resultRef}
              className="flex-1 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-800 p-4 whitespace-pre-wrap text-sm overflow-y-auto scroll-smooth"
            >
              {result}
            </div>
            
            {/* Scroll to top button */}
            <button
              ref={scrollToTopRef}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-10 h-10 rounded-full bg-black text-white shadow-lg hover:bg-zinc-800 transition-colors animate-in fade-in duration-200"
              style={{ display: "none" }}
            >
              ↑
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


