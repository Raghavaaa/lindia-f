"use client";
import React, { useState, useEffect } from "react";
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
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Load all clients for the dropdown
  useEffect(() => {
    try {
      const raw = localStorage.getItem("legalindia_clients");
      if (raw) {
        const clientsData = JSON.parse(raw);
        setAllClients(clientsData);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  }, []);

  // Set selected client when prop changes
  useEffect(() => {
    if (client) {
      setSelectedClientId(client.id);
    }
  }, [client]);

  return (
    <div style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Client chip */}
      {client && (
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
      )}

      {/* Module pills - always visible */}
      <ModulePills activeModule={activeModule} onSelect={onModuleChange} />

      {/* Module content */}
      <div style={{ flex: 1, marginTop: 16, overflowY: "auto" }}>
        {/* Always show the prompt window */}
        <div>
          {/* Client Selection Dropdown */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ 
              display: "block", 
              fontSize: 14, 
              fontWeight: 500, 
              color: "#374151", 
              marginBottom: 6 
            }}>
              Select Client:
            </label>
            <select
              value={selectedClientId || ""}
              onChange={(e) => setSelectedClientId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #D1D5DB",
                background: "#FFFFFF",
                fontSize: 14,
                color: "#374151"
              }}
              aria-label="Select client for research"
            >
              <option value="">Choose a client...</option>
              {allClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>
          
          <ResearchModule 
            clientId={selectedClientId || client?.id || ""}
          />
        </div>

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