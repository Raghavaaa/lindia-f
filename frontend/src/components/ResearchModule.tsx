"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type ResearchItem = {
  id: string;
  title: string;
  query: string;
  adminPrompt?: string | null;
  resultText: string;
  ts: number;
};

type Props = {
  clientId: string;
};

export default function ResearchModule({ clientId }: Props) {
  const [query, setQuery] = useState("");
  const [adminPrompt, setAdminPrompt] = useState("Use Indian case law & statutes where relevant. Summarize in 5 bullet points.");
  const [showAdmin, setShowAdmin] = useState(false);
  const [running, setRunning] = useState(false);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load research items for this client
  useEffect(() => {
    try {
      const key = `legalindia::client::${clientId}::research`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const items = JSON.parse(saved);
        setResearchItems(items);
        if (items.length > 0 && !selectedResult) {
          setSelectedResult(items[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading research items:", error);
    }
  }, [clientId, selectedResult]);

  // Save research items
  useEffect(() => {
    try {
      const key = `legalindia::client::${clientId}::research`;
      localStorage.setItem(key, JSON.stringify(researchItems));
    } catch (error) {
      console.error("Error saving research items:", error);
    }
  }, [researchItems, clientId]);

  // Handle Ctrl+Enter to run research
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter" && textareaRef.current === document.activeElement) {
        e.preventDefault();
        runResearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

      const queryText = query.trim();
      const newItem: ResearchItem = {
        id: uuidv4(),
        title: queryText.substring(0, 60),
        query: queryText,
        adminPrompt: showAdmin ? adminPrompt.trim() : null,
        resultText,
        ts: Date.now()
      };

      setResearchItems(prev => [newItem, ...prev]);
      setSelectedResult(newItem.id);
      setQuery("");
      setRunning(false);
    }, 1000);
  }

  const currentResult = selectedResult ? researchItems.find(r => r.id === selectedResult) : null;

  return (
    <div>
      {/* Query Input */}
      <div style={{ marginBottom: 20 }}>
        <textarea
          ref={textareaRef}
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

        {/* Run Button */}
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
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
          Press Ctrl+Enter to run
        </div>
      </div>

      {/* Current Result */}
      {currentResult && (
        <div style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20
        }}>
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
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>
              {new Date(currentResult.ts).toLocaleString()}
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
            {currentResult.resultText}
          </pre>
        </div>
      )}

      {/* Research History */}
      {researchItems.length > 0 && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1F2937" }}>
            Research History ({researchItems.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {researchItems.map((item) => {
              const time = new Date(item.ts);
              const hours = String(time.getHours()).padStart(2, '0');
              const minutes = String(time.getMinutes()).padStart(2, '0');
              const timeStr = `${hours}:${minutes}`;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedResult(item.id)}
                  className="muted"
                  style={{
                    textAlign: "left",
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: selectedResult === item.id ? "#E8F1FF" : "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    color: selectedResult === item.id ? "#2E7CF6" : "#6B7280",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedResult !== item.id) {
                      e.currentTarget.style.background = "#F8FAFF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedResult !== item.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                  aria-label={`Research from ${timeStr}: ${item.title}`}
                >
                  {timeStr} • {item.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
