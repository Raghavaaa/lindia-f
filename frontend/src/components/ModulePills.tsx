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
      gap: 4, 
      flexDirection: "row",
      marginBottom: 16,
      borderBottom: "1px solid #F1F5F9",
      paddingBottom: 12,
      alignItems: "flex-start",
      flexWrap: "nowrap",
      justifyContent: "flex-start",
      width: "100%",
      overflowX: "visible"
    }}>
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => onSelect(module.id)}
          tabIndex={0}
          style={{
            padding: "8px 16px",
            height: 36,
            borderRadius: 18,
            border: "1px solid #E6E9EE",
            background: activeModule === module.id ? "#2E7CF6" : "#FFFFFF",
            color: activeModule === module.id ? "#FFFFFF" : "#6B7280",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            minWidth: "fit-content",
            flex: "0 0 auto"
          }}
          onMouseEnter={(e) => {
            if (activeModule !== module.id) {
              e.currentTarget.style.background = "#E8F1FF";
              e.currentTarget.style.color = "#2E7CF6";
              e.currentTarget.style.borderColor = "#2E7CF6";
            }
          }}
          onMouseLeave={(e) => {
            if (activeModule !== module.id) {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = "#6B7280";
              e.currentTarget.style.borderColor = "#E6E9EE";
            }
          }}
          aria-label={`Module ${module.label}`}
        >
          {module.label}
        </button>
      ))}
    </div>
  );
}