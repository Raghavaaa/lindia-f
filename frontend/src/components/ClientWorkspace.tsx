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
  onResearchComplete?: () => void;
};

export default function ClientWorkspace({ 
  client, 
  activeModule, 
  onModuleChange,
  selectedHistoryItem,
  onClearHistorySelection,
  onResearchComplete
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

      {/* Module content */}
      <div style={{ flex: 1, marginTop: 8, display: "flex", gap: 16 }}>
        {/* Left side - Prompt window */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Client Selection Dropdown */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ 
              display: "block", 
              fontSize: 10, 
              fontWeight: 500, 
              color: "#374151", 
              marginBottom: 2 
            }}>
              Client:
            </label>
            <select
              value={selectedClientId || ""}
              onChange={(e) => setSelectedClientId(e.target.value)}
              style={{
                width: "60%",
                padding: "3px 6px",
                borderRadius: 3,
                border: "1px solid #D1D5DB",
                background: "#FFFFFF",
                fontSize: 11,
                color: "#374151"
              }}
              aria-label="Select client for research"
            >
              <option value="">Choose...</option>
              {allClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          
          <ResearchModule 
            clientId={selectedClientId || client?.id || ""}
            onResearchComplete={onResearchComplete}
          />
        </div>

        {/* Right side - Module pills */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <ModulePills activeModule={activeModule} onSelect={onModuleChange} />
        </div>
      </div>
    </div>
  );
}