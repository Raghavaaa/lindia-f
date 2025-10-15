"use client";
import React from "react";

type HistoryItem = {
  id: string;
  clientId: string;
  module: string;
  timestamp: number;
  title: string;
  content: string;
};

export default function History({ 
  items, 
  onSelect 
}: { 
  items: HistoryItem[]; 
  onSelect: (item: HistoryItem) => void; 
}) {
  return (
    <div style={{ padding: 16, borderTop: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1F2937" }}>
        History
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.length === 0 ? (
          <div style={{ color: "#9CA3AF", fontSize: 13, padding: "8px 0" }}>
            No history yet.
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 13,
                color: "#374151",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFF";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              aria-label={`History item: ${item.title}, clicked on ${new Date(item.timestamp).toLocaleDateString()}`}
            >
              <div style={{ fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>
                {item.title.length > 60 ? item.title.substring(0, 60) + "..." : item.title}
              </div>
              <div style={{ color: "#9CA3AF", fontSize: 11 }}>
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}