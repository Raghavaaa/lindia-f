"use client";
import React from "react";
import ModulePills from "./ModulePills";
import ResearchModule from "./ResearchModule";

type Client = {
  id: string;
  name: string;
  phone?: string;
};

type HistoryItem = {
  id: string;
  title: string;
  query: string;
  adminPrompt?: string | null;
  resultText: string;
  ts: number;
};

type Props = {
  client: Client | null;
  activeModule: string | null;
  onModuleChange: (module: string) => void;
  selectedHistoryItem: HistoryItem | null;
  onClearHistorySelection: () => void;
};

export default function ClientWorkspace({ 
  client, 
  activeModule, 
  onModuleChange,
  selectedHistoryItem,
  onClearHistorySelection
}: Props) {
  if (!client) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: 400,
        color: "#9CA3AF",
        fontSize: 16
      }}>
        Select a client.
      </div>
    );
  }

  return (
    <div style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Client chip */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        marginBottom: 16
      }}>
        <div style={{
          padding: "6px 12px",
          background: "#E8F1FF",
          borderRadius: 16,
          fontSize: 13,
          color: "#2E7CF6",
          fontWeight: 500
        }}
        aria-label={`Active client: ${client.name}`}
        >
          Client: {client.name}
        </div>
      </div>

      {/* Module pills */}
      <ModulePills activeModule={activeModule} onSelect={onModuleChange} />

      {/* Module content */}
      <div style={{ flex: 1, marginTop: 16, overflowY: "auto" }}>
        {!activeModule && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: 200,
            color: "#9CA3AF",
            fontSize: 16
          }}>
            Select a module.
          </div>
        )}

        {activeModule === "Research" && (
          <ResearchModule 
            clientId={client.id}
            selectedHistoryItem={selectedHistoryItem}
            onClearHistorySelection={onClearHistorySelection}
          />
        )}

        {activeModule === "Property Opinion" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Property Opinion</h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
              Generate comprehensive property opinions for your clients
            </p>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>
              Property Opinion module coming soon...
            </div>
          </div>
        )}

        {activeModule === "Case" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Case Management</h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
              Track and manage your legal cases efficiently
            </p>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>
              Case Management module coming soon...
            </div>
          </div>
        )}

        {activeModule === "Junior" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Junior AI</h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
              Your AI legal assistant for drafting and research
            </p>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>
              Junior AI module coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}