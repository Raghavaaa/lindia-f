"use client";
import React, { useEffect, useState } from "react";
import ClientList from "../../components/ClientList";
import ClientWorkspace from "../../components/ClientWorkspace";
import ClientModal from "../../components/ClientModal";
import { v4 as uuidv4 } from "uuid";

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

export default function AppPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load clients from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("legalindia_clients");
      if (raw) {
        const clientsData = JSON.parse(raw);
        setClients(clientsData);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  }, []);

  // Save clients to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("legalindia_clients", JSON.stringify(clients));
    } catch (error) {
      console.error("Error saving clients:", error);
    }
  }, [clients]);

  function handleCreateClient(c: { name: string; phone?: string }) {
    const newClient: Client = {
      id: uuidv4(),
      name: c.name,
      phone: c.phone
    };
    setClients((prev) => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
  }

  function handleSelectClient(clientId: string) {
    setSelectedClientId(clientId);
  }

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left: Client List (220px) */}
      <div style={{ 
        width: 220, 
        borderRight: "1px solid #F1F5F9",
        background: "#FFFFFF",
        flexShrink: 0
      }}>
        <ClientList 
          clients={clients} 
          selectedId={selectedClientId} 
          onSelect={handleSelectClient} 
          onOpenNew={() => setShowModal(true)} 
        />
      </div>

      {/* Center: Client Workspace (fluid) */}
      <main style={{ flex: 1, background: "#FFFFFF", minWidth: 0 }}>
        <ClientWorkspace 
          client={selectedClient}
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
      </main>

      <ClientModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onCreate={handleCreateClient} 
      />
    </div>
  );
}