"use client";
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type Client = {
  id: string;
  name: string;
  phone?: string;
  folders?: Array<{ id: string; title: string; type: string; ts: number; items: any[] }>;
  research?: Array<{ id: string; title: string; query: string; adminPrompt?: string; result: string; ts: number }>;
};

type Props = {
  client: Client;
  onUpdateClient: (client: Client) => void;
};

export default function ResearchPane({ client, onUpdateClient }: Props) {
  const [query, setQuery] = useState("");
  const [adminPrompt, setAdminPrompt] = useState("Use Indian case law & statutes where relevant. Summarize in 5 bullet points.");
  const [showAdmin, setShowAdmin] = useState(false);
  const [running, setRunning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const researchItems = client.research || [];

  function runResearch() {
    if (!query.trim()) {
      alert("Enter a research query.");
      return;
    }

    setRunning(true);

    // Simulate API call delay
    setTimeout(() => {
      const resultText = `Research Summary for: "${query}"

Key Findings:
• This is a demo research result showing the format
• Indian case law analysis would appear here
• Relevant statutes and precedents would be cited
• Practical implications for the client would be outlined
• Next steps and recommendations would be provided

${adminPrompt && showAdmin ? `\n(Admin prompt applied: ${adminPrompt})` : ""}`;

      const newResearchItem = {
        id: uuidv4(),
        title: query.length > 60 ? query.substring(0, 60) + "..." : query,
        query: query.trim(),
        adminPrompt: showAdmin ? adminPrompt.trim() : undefined,
        result: resultText,
        ts: Date.now()
      };

      const updatedClient = {
        ...client,
        research: [newResearchItem, ...researchItems]
      };

      onUpdateClient(updatedClient);
      setSelectedResult(newResearchItem.id);
      setQuery("");
      setRunning(false);

      // Focus on results for screen readers
      if (resultsRef.current) {
        resultsRef.current.focus();
      }
    }, 1000);
  }

  function saveResult() {
    if (!selectedResult) {
      alert("No result to save. Run a research query first.");
      return;
    }

    const result = researchItems.find(r => r.id === selectedResult);
    if (!result) return;

    const title = prompt("Enter a title for this research result:", result.title) || result.title;
    
    const updatedResult = { ...result, title };
    const updatedResearch = researchItems.map(r => r.id === selectedResult ? updatedResult : r);
    
    const updatedClient = {
      ...client,
      research: updatedResearch
    };

    onUpdateClient(updatedClient);
    alert("Research result saved successfully!");
  }

  function copyToClipboard() {
    const result = researchItems.find(r => r.id === selectedResult);
    if (!result) return;
    
    navigator.clipboard.writeText(result.result).then(() => {
      alert("Result copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy to clipboard");
    });
  }

  const currentResult = selectedResult ? researchItems.find(r => r.id === selectedResult) : researchItems[0];

  return (
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Legal Research</h3>
      
      {/* Research Input */}
      <div style={{ marginBottom: 24 }}>
        <textarea
          placeholder="Enter your legal research question (e.g., 'What are the requirements for adverse possession in urban properties under Indian law?')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            minHeight: 100,
            padding: 12,
            border: "1px solid #E6E9EE",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            resize: "vertical",
            marginBottom: 12
          }}
          aria-label="Research query input"
        />

        {/* Admin Prompt Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <input
            type="checkbox"
            id="showAdmin"
            checked={showAdmin}
            onChange={(e) => setShowAdmin(e.target.checked)}
            style={{ margin: 0 }}
            aria-label="Show admin prompt"
          />
          <label htmlFor="showAdmin" style={{ fontSize: 13, color: "#6B7280", cursor: "pointer" }}>
            Show admin prompt
          </label>
        </div>

        {showAdmin && (
          <textarea
            value={adminPrompt}
            onChange={(e) => setAdminPrompt(e.target.value)}
            style={{
              width: "100%",
              minHeight: 80,
              padding: 12,
              border: "1px solid #E6E9EE",
              borderRadius: 12,
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              resize: "vertical",
              marginBottom: 12
            }}
            aria-label="Admin prompt for research customization"
          />
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={runResearch}
            disabled={running}
            style={{
              padding: "12px 24px",
              background: running ? "#9CA3AF" : "#2E7CF6",
              color: "white",
              border: "none",
              borderRadius: 28,
              cursor: running ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 2px 4px rgba(10, 15, 25, 0.08)"
            }}
            aria-label="Run research query"
          >
            {running ? "Running…" : "Run Research"}
          </button>
          <button
            onClick={() => setQuery("")}
            style={{
              padding: "12px 24px",
              background: "transparent",
              color: "#6B7280",
              border: "1px solid #E6E9EE",
              borderRadius: 28,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E8F1FF";
              e.currentTarget.style.color = "#2E7CF6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6B7280";
            }}
            aria-label="Clear query"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results Display */}
      {currentResult && (
        <div
          ref={resultsRef}
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16
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
              {currentResult.title}
            </h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "4px 8px",
                  background: "transparent",
                  color: "#6B7280",
                  border: "1px solid #E6E9EE",
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
                  background: "#2E7CF6",
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
            {currentResult.result}
          </pre>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>
            {new Date(currentResult.ts).toLocaleString()}
          </div>
        </div>
      )}

      {/* Research History */}
      {researchItems.length > 0 && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1F2937" }}>
            Research History ({researchItems.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {researchItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedResult(item.id)}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: selectedResult === item.id ? "#E8F1FF" : "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#374151",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
                onMouseEnter={(e) => {
                  if (selectedResult !== item.id) {
                    e.currentTarget.style.background = "#F8FAFF";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedResult !== item.id) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
                aria-label={`Research item: ${item.title}, created on ${new Date(item.ts).toLocaleDateString()}`}
              >
                <div style={{ fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div style={{ color: "#9CA3AF", fontSize: 11 }}>
                  {new Date(item.ts).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
