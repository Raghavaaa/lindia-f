"use client";
import React, { useState } from "react";

export default function JuniorPanel({ onRun }: { onRun: (query: string) => void }) {
  const [query, setQuery] = useState("");

  function run() {
    if (!query.trim()) return alert("Enter a question.");
    onRun(query.trim());
  }

  return (
    <div style={{ padding: "16px 0" }}>
      <textarea
        placeholder="Ask Junior AI anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          minHeight: 120,
          padding: 12,
          border: "1px solid #E6E9EE",
          borderRadius: 12,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          resize: "vertical",
          marginBottom: 16
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button 
          onClick={run}
          style={{
            padding: "12px 24px",
            background: "#2E7CF6",
            color: "white",
            border: "none",
            borderRadius: 28,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(10, 15, 25, 0.08)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(10, 15, 25, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(10, 15, 25, 0.08)";
          }}
        >
          Ask Junior
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
        >
          Clear
        </button>
      </div>
    </div>
  );
}