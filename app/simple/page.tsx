"use client";
import { useState } from "react";

export default function SimplePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">LegalIndia.ai - Simple Version</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Legal Research</h2>
          
          <form onSubmit={handleResearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter your legal query:</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Example: My property was encroached by seller — what legal remedy do I have?"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? "Researching..." : "Run Research"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Research Result:</h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">
          <p>Simple version - No login required</p>
          <p>Direct access to legal research functionality</p>
        </div>
      </div>
    </div>
  );
}
