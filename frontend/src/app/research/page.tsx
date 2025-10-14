"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { apiFetch, config } from "@/lib/config";

interface ResearchResult {
  id: string;
  query: string;
  result: string;
  clientId?: string;
  createdAt: string;
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientName, setClientName] = useState("");
  const [streaming, setStreaming] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);
  const scrollToTopRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (streaming && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result, streaming]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (resultRef.current && scrollToTopRef.current) {
        const { scrollTop } = resultRef.current;
        scrollToTopRef.current.style.display = scrollTop > 100 ? 'block' : 'none';
      }
    };

    const resultElement = resultRef.current;
    if (resultElement) {
      resultElement.addEventListener('scroll', handleScroll);
      return () => resultElement.removeEventListener('scroll', handleScroll);
    }
  }, [result]);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setSaved(false);
    setStreaming(true);

    try {
      const response = await apiFetch(config.endpoints.research.run, {
        method: "POST",
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let fullResult = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullResult += data.content;
                setResult(fullResult);
              }
              if (data.done) {
                setStreaming(false);
                break;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      setResult(`Error: ${error}`);
      setStreaming(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResearch = async () => {
    if (!result || !clientName.trim()) {
      alert("Please enter a client name to save the research");
      return;
    }

    setSaving(true);
    try {
      const response = await apiFetch(config.endpoints.research.save, {
        method: "POST",
        body: JSON.stringify({
          query,
          result,
          clientName: clientName.trim(),
        }),
      });

      if (response.ok) {
        setSaved(true);
        setClientName("");
      } else {
        alert("Failed to save research");
      }
    } catch (error) {
      alert("Error saving research");
    } finally {
      setSaving(false);
    }
  };

  const scrollToTop = () => {
    if (resultRef.current) {
      resultRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            LegalIndia.ai
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/history" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            History
          </Link>
          <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Login
          </Link>
          <Link href="/settings" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Settings
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-6xl">
            Legal Research
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            AI-powered legal research and analysis for Indian law. Get instant insights, case law references, and practical legal guidance.
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleResearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter your legal query:</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800"
                rows={4}
                placeholder="Example: My property was encroached by seller — what legal remedy do I have?"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? (streaming ? "Streaming..." : "Researching...") : "Run Research"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Research Result:</h3>
              <button
                ref={scrollToTopRef}
                onClick={scrollToTop}
                className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                style={{ display: 'none' }}
              >
                Scroll to Top
              </button>
            </div>
            
            <div 
              ref={resultRef}
              className="prose max-w-none mb-6 max-h-96 overflow-y-auto"
            >
              <pre className="whitespace-pre-wrap text-sm bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                {result}
                {streaming && <span className="animate-pulse">|</span>}
              </pre>
            </div>

            {/* Save Research Section */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
              <h4 className="text-sm font-medium mb-3">Save Research:</h4>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  className="flex-1 p-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-sm"
                />
                <button
                  onClick={handleSaveResearch}
                  disabled={saving || saved || streaming}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-green-700"
                >
                  {saving ? "Saving..." : saved ? "Saved ✓" : "Save Research"}
                </button>
              </div>
              {saved && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">Research saved successfully under client: {clientName}</p>
                  <Link 
                    href="/history"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View in History →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
