"use client";
import React, { useEffect, useState } from "react";
import ClientList from "../../components/ClientList";
import ClientWorkspace from "../../components/ClientWorkspace";
import ClientModal from "../../components/ClientModal";
import HistoryPanel from "../../components/HistoryPanel";
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
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

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
    setSelectedHistoryItem(null); // Clear history selection when changing clients
  }

  function handleHistoryItemSelect(item: HistoryItem) {
    setSelectedHistoryItem(item);
  }

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  return (
    <>
      <div style={{ minHeight: "100vh", display: "flex", position: "relative" }}>
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
        <main style={{ flex: 1, background: "#FFFFFF", minWidth: 0, position: "relative" }}>
          {/* Mobile History Toggle Button */}
          {activeModule && (
            <button
              className="mobile-toggle"
              onClick={() => setMobileHistoryOpen(!mobileHistoryOpen)}
              style={{
                position: "fixed",
                bottom: 80,
                right: 16,
                zIndex: 900
              }}
              aria-label="Toggle history panel"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          <ClientWorkspace 
            client={selectedClient}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            selectedHistoryItem={selectedHistoryItem}
            onClearHistorySelection={() => setSelectedHistoryItem(null)}
          />
        </main>

        {/* Right: History Panel (320px) */}
        <HistoryPanel 
          clientId={selectedClientId}
          clientName={selectedClient?.name || null}
          activeModule={activeModule}
          onSelectItem={handleHistoryItemSelect}
          selectedItemId={selectedHistoryItem?.id}
          isMobileOpen={mobileHistoryOpen}
          onMobileClose={() => setMobileHistoryOpen(false)}
          onModuleChange={setActiveModule}
        />

        <ClientModal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onCreate={handleCreateClient} 
        />
      </div>

      {/* Mobile Overlay */}
      {mobileHistoryOpen && (
        <div 
          className="mobile-overlay active"
          onClick={() => setMobileHistoryOpen(false)}
          aria-label="Close history panel"
        />
      )}
    </>
  );
}