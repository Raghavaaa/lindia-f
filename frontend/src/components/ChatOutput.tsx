"use client";
import React from "react";

export default function ChatOutput({ messages }: { messages: { id: string; role: "user" | "assistant"; text: string; ts: number }[] }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && <div style={{ color: "#9CA3AF" }}>No research yet — run a query to see AI results here.</div>}
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {/* Avatar */}
            <div style={{ width: 40, height: 40, borderRadius: 10, background: m.role === "assistant" ? "#2E7CF6" : "#F3F4F6", color: m.role === "assistant" ? "#fff" : "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {m.role === "assistant" ? "GPT" : "U"}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: "100%" }}>
              <div style={{
                background: m.role === "assistant" ? "#EEF6FF" : "#F8FAFB",
                padding: 12,
                borderRadius: 12,
                borderTopLeftRadius: m.role === "assistant" ? 12 : 4,
                borderTopRightRadius: m.role === "assistant" ? 4 : 12,
                whiteSpace: "pre-wrap",
                color: "#0A0A0A"
              }}>
                {m.text}
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{new Date(m.ts).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

