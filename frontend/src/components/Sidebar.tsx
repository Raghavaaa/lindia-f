"use client";
import React from "react";

export type ClientItem = { id: string; name: string; phone?: string };

type Props = {
  clients: ClientItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onOpenNew: () => void;
};

export default function Sidebar({ clients, selectedId, onSelect, onOpenNew }: Props) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginBottom: 12 
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>
          Clients
        </div>
        <button 
          onClick={onOpenNew} 
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 4,
            border: "1px solid #E6E9EE",
            background: "transparent",
            cursor: "pointer",
            color: "#6B7280",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#E8F1FF"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          aria-label="Add new client"
        >
          + New
        </button>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {clients.length === 0 && (
          <div style={{ color: "#9CA3AF", fontSize: 13, padding: "8px 0" }}>
            No clients yet
          </div>
        )}
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: selectedId === c.id ? "#E8F1FF" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
            onMouseEnter={(e) => {
              if (selectedId !== c.id) {
                e.currentTarget.style.background = "#F8FAFF";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedId !== c.id) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
            aria-label={`Client: ${c.name}`}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>
              {c.name}
            </div>
            {c.phone && (
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                {c.phone}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}