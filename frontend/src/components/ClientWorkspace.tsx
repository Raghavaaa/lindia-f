"use client";
import React, { useState } from "react";
import ModulePills from "./ModulePills";
import ResearchModule from "./ResearchModule";

type Client = {
  id: string;
  name: string;
  phone?: string;
};

type Props = {
  client: Client | null;
};

export default function ClientWorkspace({ client }: Props) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

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
    <div style={{ padding: 24 }}>
      {/* Client chip */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        marginBottom: 24 
      }}>
        <div style={{
          padding: "4px 12px",
          background: "#E8F1FF",
          borderRadius: 16,
          fontSize: 13,
          color: "#2E7CF6",
          fontWeight: 500
        }}>
          Client: {client.name}
        </div>
      </div>

      {/* Module pills */}
      <ModulePills activeModule={activeModule} onSelect={setActiveModule} />

      {/* Module content */}
      <div>
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
          <ResearchModule clientId={client.id} />
        )}

        {activeModule === "Property Opinion" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Property Opinion</h3>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>
              Property Opinion module coming soon...
            </div>
          </div>
        )}

        {activeModule === "Case" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Case Management</h3>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>
              Case Management module coming soon...
            </div>
          </div>
        )}

        {activeModule === "Junior" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Junior AI</h3>
            <div style={{ color: "#9CA3AF", fontSize: 14 }}>
              Junior AI module coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}