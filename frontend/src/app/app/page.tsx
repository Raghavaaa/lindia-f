"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ClientList from "../../components/ClientList";
import ClientWorkspace from "../../components/ClientWorkspace";
import ClientModal from "../../components/ClientModal";
import HistoryPanel from "../../components/HistoryPanel";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    setSelectedHistoryItem(null);
  }

  function handleHistoryItemSelect(item: HistoryItem) {
    setSelectedHistoryItem(item);
  }

  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  return (
    <>
      <div className="min-h-screen flex relative">
        {/* Left: Client List */}
        <motion.aside
          initial={{ x: -220 }}
          animate={{ x: 0 }}
          className="w-[220px] border-r border-border bg-card shrink-0 hidden md:block"
        >
          <ClientList 
            clients={clients} 
            selectedId={selectedClientId} 
            onSelect={handleSelectClient} 
            onOpenNew={() => setShowModal(true)} 
          />
        </motion.aside>

        {/* Center: Client Workspace (fluid) */}
        <main className="flex-1 bg-background min-w-0 relative">
          {/* Mobile History Toggle Button */}
          {activeModule && (
            <Button
              variant="default"
              size="icon"
              className="md:hidden fixed bottom-20 right-4 z-[900] shadow-lg"
              onClick={() => setMobileHistoryOpen(!mobileHistoryOpen)}
            >
              {mobileHistoryOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}

          <ClientWorkspace 
            client={selectedClient}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            selectedHistoryItem={selectedHistoryItem}
            onClearHistorySelection={() => setSelectedHistoryItem(null)}
            onResearchComplete={() => setRefreshTrigger(prev => prev + 1)}
          />
        </main>

        {/* Right: History Panel */}
        <motion.aside
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          className={`hidden lg:block ${mobileHistoryOpen ? 'mobile-open' : ''}`}
        >
          <HistoryPanel 
            clientId={selectedClientId}
            clientName={selectedClient?.name || null}
            activeModule={activeModule}
            onSelectItem={handleHistoryItemSelect}
            selectedItemId={selectedHistoryItem?.id}
            isMobileOpen={mobileHistoryOpen}
            onMobileClose={() => setMobileHistoryOpen(false)}
            refreshTrigger={refreshTrigger}
          />
        </motion.aside>

        <ClientModal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onCreate={handleCreateClient} 
        />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileHistoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-[899] md:hidden"
            onClick={() => setMobileHistoryOpen(false)}
            aria-label="Close history panel"
          />
        )}
      </AnimatePresence>
    </>
  );
}
