"use client";
import React from "react";

type Props = {
  activeModule: string | null;
  onSelect: (module: string) => void;
};

export default function ModulePills({ activeModule, onSelect }: Props) {
  const modules = [
    { id: "Property Opinion", label: "Property Opinion" },
    { id: "Research", label: "Research" },
    { id: "Case", label: "Case" },
    { id: "Junior", label: "Junior" }
  ];

  return (
    <div style={{ 
      display: "flex", 
      gap: 8, 
      marginBottom: 16,
      borderBottom: "1px solid #F1F5F9",
      paddingBottom: 12
    }}>
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => onSelect(module.id)}
          style={{
            padding: "6px 12px",
            borderRadius: 16,
            border: "1px solid #E6E9EE",
            background: activeModule === module.id ? "#2E7CF6" : "transparent",
            color: activeModule === module.id ? "white" : "#6B7280",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (activeModule !== module.id) {
              e.currentTarget.style.background = "#E8F1FF";
              e.currentTarget.style.color = "#2E7CF6";
            }
          }}
          onMouseLeave={(e) => {
            if (activeModule !== module.id) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6B7280";
            }
          }}
          aria-label={`Select ${module.label} module`}
        >
          {module.label}
        </button>
      ))}
    </div>
  );
}