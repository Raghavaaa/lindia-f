"use client";
import { useState } from "react";
import Link from "next/link";

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientName, setClientName] = useState("");

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setSaved(false);

    try {
      const response = await fetch("/api/simple-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResult(data.result || "No result received");
    } catch (error) {
      setResult("Error: " + error);
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
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          result,
          clientName: clientName.trim(),
          save: true
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
          <Link href="/dashboard" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Dashboard
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
              {loading ? "Researching..." : "Run Research"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Research Result:</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  Back to Top
                </button>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <pre className="whitespace-pre-wrap text-sm bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg max-h-96 overflow-y-auto">{result}</pre>
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
                  disabled={saving || saved}
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
