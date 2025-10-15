"use client";
import React from "react";

export default function TopNav({ 
  activeModule, 
  onSelect 
}: { 
  activeModule: string; 
  onSelect?: (m: string) => void; 
}) {
  const modules = ["Property Opinion", "Research", "Case", "Junior"];
  return (
    <nav style={{ 
      borderBottom: "1px solid #E5E7EB", 
      padding: "8px 16px",
      display: "flex", 
      alignItems: "center", 
      gap: 8 
    }}>
      {modules.map((m) => (
        <button 
          key={m} 
          onClick={() => onSelect?.(m)} 
          style={{
            fontSize: 14,
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: activeModule === m ? "#EEF6FF" : "transparent",
            color: activeModule === m ? "#1E40AF" : "#6B7280",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            if (activeModule !== m) {
              e.currentTarget.style.background = "#F3F4F6";
            }
          }}
          onMouseLeave={(e) => {
            if (activeModule !== m) {
              e.currentTarget.style.background = "transparent";
            }
          }}
          aria-label={`Open ${m}`}
        >
          {m}
        </button>
      ))}
    </nav>
  );
}