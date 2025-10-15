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
  selectedHistoryItem: ResearchItem | null;
  onClearHistorySelection: () => void;
};

export default function ResearchModule({ clientId, selectedHistoryItem, onClearHistorySelection }: Props) {
  const [query, setQuery] = useState("");
  const [adminPrompt, setAdminPrompt] = useState("Use Indian case law & statutes where relevant. Summarize in 5 bullet points.");
  const [showAdmin, setShowAdmin] = useState(false);
  const [running, setRunning] = useState(false);
  const [currentResult, setCurrentResult] = useState<ResearchItem | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update current result when history item is selected
  useEffect(() => {
    if (selectedHistoryItem) {
      setCurrentResult(selectedHistoryItem);
    }
  }, [selectedHistoryItem]);

  // Handle Ctrl+Enter to run research
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && textareaRef.current === document.activeElement) {
        e.preventDefault();
        runResearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query, adminPrompt, showAdmin]); // Add dependencies

  function runResearch() {
    if (!query.trim()) {
      alert("Enter a research query.");
      return;
    }

    if (!clientId) {
      alert("Select a client.");
      return;
    }

    setRunning(true);
    onClearHistorySelection(); // Clear history selection when running new query

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
        title: queryText.substring(0, 60) + (queryText.length > 60 ? "..." : ""),
        query: queryText,
        adminPrompt: showAdmin ? adminPrompt.trim() : null,
        resultText,
        ts: Date.now()
      };

      // Save to localStorage
      try {
        const key = `legalindia::client::${clientId}::research`;
        const existing = localStorage.getItem(key);
        const items: ResearchItem[] = existing ? JSON.parse(existing) : [];
        
        // Add new item to front and limit to 200
        const updatedItems = [newItem, ...items].slice(0, 200);
        localStorage.setItem(key, JSON.stringify(updatedItems));
        
        // Show result
        setCurrentResult(newItem);
        setQuery("");
        
        // Show saved toast
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 3000);
      } catch (error) {
        console.error("Error saving research:", error);
        alert("Saving disabled - localStorage may be full");
      }

      setRunning(false);
    }, 1000);
  }

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Saved Toast */}
      {showSavedToast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#2E7CF6",
          color: "white",
          padding: "12px 24px",
          borderRadius: 28,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "0 4px 12px rgba(46, 124, 246, 0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          Saved • {currentResult && formatTime(currentResult.ts)}
        </div>
      )}

      {/* Module Title */}
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "#1F2937" }}>
        Legal Research
      </h3>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
        Enter your legal research question and get AI-powered analysis
      </p>

      {/* Query Input */}
      <div style={{ marginBottom: 20 }}>
        <textarea
          ref={textareaRef}
          placeholder="Enter your legal research question (e.g., 'What are the requirements for adverse possession in urban properties under Indian law?')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
          style={{
            width: "100%",
            minHeight: 120,
            padding: 14,
            border: "1px solid #E6E9EE",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            resize: "vertical",
            marginBottom: 12
          }}
          aria-label="Module Research prompt"
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
            className="input"
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={runResearch}
            disabled={running}
            className="btn btn-primary"
            style={{
              padding: "12px 24px",
              background: running ? "#9CA3AF" : "#2E7CF6",
              color: "white",
              border: "none",
              borderRadius: 28,
              cursor: running ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(46, 124, 246, 0.2)"
            }}
            aria-label="Run Research action"
          >
            {running ? "Running…" : "Run Research"}
          </button>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>
            Press Ctrl+Enter to run
          </div>
        </div>
      </div>

      {/* Current Result */}
      {currentResult && (
        <div style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12
          }}>
            <h4 style={{
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              color: "#1F2937",
              flex: 1
            }}>
              {currentResult.title}
            </h4>
            <div style={{ 
              fontSize: 11, 
              color: "#9CA3AF",
              marginLeft: 12,
              whiteSpace: "nowrap"
            }}>
              Saved {formatTime(currentResult.ts)}
            </div>
          </div>
          
          {currentResult.query && (
            <div style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 12,
              fontStyle: "italic"
            }}>
              Query: {currentResult.query}
            </div>
          )}
          
          <pre style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "#374151",
            whiteSpace: "pre-wrap",
            fontFamily: "Inter, sans-serif",
            margin: 0
          }}>
            {currentResult.resultText}
          </pre>
        </div>
      )}

      {!currentResult && !running && (
        <div style={{
          padding: 40,
          textAlign: "center",
          color: "#9CA3AF",
          fontSize: 14,
          border: "1px dashed #E6E9EE",
          borderRadius: 12
        }}>
          Your research results will appear here
        </div>
      )}
    </div>
  );
}

