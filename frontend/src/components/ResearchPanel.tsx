"use client";
import React, { useState, useRef } from "react";

type ResearchResult = {
  id: string;
  title: string;
  module: string;
  clientId?: string;
  query: string;
  adminPrompt?: string;
  resultText: string;
  ts: number;
};

type Props = {
  onRun?: (query: string, adminPrompt: string | null) => void;
  onSave?: (item: ResearchResult) => void;
  selectedClientId?: string | null;
};

export default function ResearchPanel({ onRun, onSave, selectedClientId }: Props) {
  const [query, setQuery] = useState("");
  const [adminPrompt, setAdminPrompt] = useState("Use Indian case law & statutes where relevant. Summarize in 5 bullet points.");
  const [showAdmin, setShowAdmin] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [savedResults, setSavedResults] = useState<ResearchResult[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load saved results from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("legalindia_history_research");
      if (saved) {
        setSavedResults(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save results to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("legalindia_history_research", JSON.stringify(savedResults));
    } catch {}
  }, [savedResults]);

  function runResearch() {
    if (!query.trim()) {
      alert("Enter a research query.");
      return;
    }

    setRunning(true);

    // Simulate API call delay
    setTimeout(() => {
      const demoResult = `Research Summary for: "${query}"

Key Findings:
• This is a demo research result showing the format
• Indian case law analysis would appear here
• Relevant statutes and precedents would be cited
• Practical implications for the client would be outlined
• Next steps and recommendations would be provided

${adminPrompt && showAdmin ? `\n(Admin prompt applied: ${adminPrompt})` : ""}`;

      setLastResult(demoResult);
      setRunning(false);

      // Focus on results for screen readers
      if (resultsRef.current) {
        resultsRef.current.focus();
      }

      // Call parent callback if provided
      if (onRun) {
        onRun(query.trim(), showAdmin ? adminPrompt.trim() : null);
      }
    }, 1000);
  }

  function clearFields() {
    setQuery("");
    setAdminPrompt("Use Indian case law & statutes where relevant. Summarize in 5 bullet points.");
    setLastResult(null);
  }

  function saveResult() {
    if (!lastResult) {
      alert("No result to save. Run a research query first.");
      return;
    }

    const title = prompt("Enter a title for this research result:") || "Research Result";
    
    const newResult: ResearchResult = {
      id: Date.now().toString(),
      title,
      module: "Research",
      clientId: selectedClientId || undefined,
      query: query.trim(),
      adminPrompt: showAdmin ? adminPrompt.trim() : undefined,
      resultText: lastResult,
      ts: Date.now()
    };

    setSavedResults(prev => [newResult, ...prev]);
    
    // Call parent callback if provided
    if (onSave) {
      onSave(newResult);
    }

    alert("Research result saved successfully!");
  }

  function copyToClipboard() {
    if (!lastResult) return;
    
    navigator.clipboard.writeText(lastResult).then(() => {
      alert("Result copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy to clipboard");
    });
  }

  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      maxWidth: "100%"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 700,
          margin: 0,
          color: "#1F2937"
        }}>
          Legal Research Assistant
        </h3>
        <div style={{
          fontSize: 12,
          color: running ? "#DC2626" : "#059669",
          fontWeight: 500
        }}>
          {running ? "Running…" : "Ready"}
        </div>
      </div>

      {/* Query Input */}
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your legal research question (e.g., 'What are the requirements for adverse possession in urban properties under Indian law?')"
        style={{
          width: "100%",
          minHeight: 120,
          padding: 12,
          border: "1px solid #D1D5DB",
          borderRadius: 8,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          resize: "vertical",
          marginBottom: 12
        }}
        aria-label="Research query input"
      />

      {/* Admin Prompt Toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
      }}>
        <input
          type="checkbox"
          id="showAdmin"
          checked={showAdmin}
          onChange={(e) => setShowAdmin(e.target.checked)}
          style={{ margin: 0 }}
          aria-label="Show admin prompt"
        />
        <label htmlFor="showAdmin" style={{
          fontSize: 13,
          color: "#6B7280",
          cursor: "pointer"
        }}>
          Show admin prompt
        </label>
      </div>

      {/* Admin Prompt (collapsed by default) */}
      {showAdmin && (
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: "block",
            fontSize: 13,
            fontWeight: 500,
            color: "#374151",
            marginBottom: 6
          }}>
            Admin Prompt (editable)
          </label>
          <textarea
            value={adminPrompt}
            onChange={(e) => setAdminPrompt(e.target.value)}
            style={{
              width: "100%",
              minHeight: 80,
              padding: 12,
              border: "1px solid #D1D5DB",
              borderRadius: 8,
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              resize: "vertical"
            }}
            aria-label="Admin prompt for research customization"
          />
        </div>
      )}

      {/* Footer Controls */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={runResearch}
            disabled={running}
            style={{
              padding: "8px 16px",
              background: running ? "#9CA3AF" : "#1E40AF",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: running ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 500,
              transition: "background-color 0.2s"
            }}
            aria-label="Run research query"
          >
            {running ? "Running…" : "Run Research"}
          </button>
          <button
            onClick={clearFields}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#6B7280",
              border: "1px solid #D1D5DB",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Clear all fields"
          >
            Clear
          </button>
        </div>
        
        <button
          onClick={saveResult}
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: "#1E40AF",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            textDecoration: "underline"
          }}
          aria-label="Save research result"
        >
          Save Result
        </button>
      </div>

      {/* Results Display */}
      {lastResult && (
        <div
          ref={resultsRef}
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            padding: 16,
            marginTop: 16
          }}
          tabIndex={-1}
          aria-label="Research results"
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              color: "#1F2937"
            }}>
              Research Results
            </h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "4px 8px",
                  background: "transparent",
                  color: "#6B7280",
                  border: "1px solid #D1D5DB",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11
                }}
                aria-label="Copy results to clipboard"
              >
                Copy
              </button>
              <button
                onClick={saveResult}
                style={{
                  padding: "4px 8px",
                  background: "#1E40AF",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 11
                }}
                aria-label="Save this result"
              >
                Save
              </button>
            </div>
          </div>
          <pre style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: "#374151",
            whiteSpace: "pre-wrap",
            fontFamily: "Inter, sans-serif",
            margin: 0
          }}>
            {lastResult}
          </pre>
        </div>
      )}

      {/* Saved Results Count */}
      {savedResults.length > 0 && (
        <div style={{
          fontSize: 12,
          color: "#6B7280",
          marginTop: 12,
          textAlign: "center"
        }}>
          {savedResults.length} result{savedResults.length !== 1 ? 's' : ''} saved
        </div>
      )}
    </div>
  );
}