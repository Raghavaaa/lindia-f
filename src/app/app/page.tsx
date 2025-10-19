"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ClientList from "../../components/ClientList";
import ClientModal from "../../components/ClientModal";
import HistoryPanel from "../../components/HistoryPanel";
import ResearchModule from "../../components/ResearchModule";
import PropertyOpinionModule from "../../components/PropertyOpinionModule";
import CaseModule from "../../components/CaseModule";
import JuniorModule from "../../components/JuniorModule";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

function AppPageContent() {
  const searchParams = useSearchParams();
  const moduleParam = searchParams?.get("module") || "research";
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Load clients from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("legalindia_clients");
      if (raw) {
        const clientsData = JSON.parse(raw);
        setClients(clientsData);
      }
    } catch (error) {
      // Handle error silently
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

  // Render the appropriate module based on URL parameter
  const renderModule = () => {
    const clientId = selectedClientId || "";
    
    switch (moduleParam) {
      case "property":
        return <PropertyOpinionModule clientId={clientId} onComplete={() => setRefreshTrigger(prev => prev + 1)} />;
      case "case":
        return <CaseModule clientId={clientId} onComplete={() => setRefreshTrigger(prev => prev + 1)} />;
      case "junior":
        return <JuniorModule clientId={clientId} onComplete={() => setRefreshTrigger(prev => prev + 1)} />;
      case "research":
      default:
        return <ResearchModule clientId={clientId} onResearchComplete={() => setRefreshTrigger(prev => prev + 1)} />;
    }
  };

  return (
    <div className="h-screen flex relative pt-16 md:pt-[120px] bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Left: Client List - Desktop */}
      <motion.aside
        initial={{ x: -220 }}
        animate={{ x: 0 }}
        className="w-[220px] border-r border-border bg-background shrink-0 hidden md:block fixed left-0 top-16 md:top-[120px] bottom-14 overflow-y-auto z-10"
      >
        <ClientList 
          clients={clients} 
          selectedId={selectedClientId} 
          onSelect={handleSelectClient} 
          onOpenNew={() => setShowModal(true)} 
        />
      </motion.aside>

      {/* Left: Client List - Mobile */}
      <motion.aside
        initial={{ x: -220 }}
        animate={{ x: showMobileSidebar ? 0 : -220 }}
        className="w-[220px] border-r border-border bg-background shrink-0 md:hidden fixed left-0 top-16 bottom-14 overflow-y-auto z-50"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Clients</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSidebar(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ClientList 
          clients={clients} 
          selectedId={selectedClientId} 
          onSelect={(id) => {
            handleSelectClient(id);
            setShowMobileSidebar(false);
          }} 
          onOpenNew={() => {
            setShowModal(true);
            setShowMobileSidebar(false);
          }} 
        />
      </motion.aside>

      {/* Center: Module Workspace */}
      <main className="flex-1 bg-background min-w-0 md:ml-[220px] md:mr-[320px] p-4 md:p-6 overflow-y-auto h-full">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileSidebar(true)}
            className="flex items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            Clients
          </Button>
        </div>

        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold mb-6 shadow-sm"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Client: {selectedClient.name}
          </motion.div>
        )}
        
        <motion.div
          key={moduleParam}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {renderModule()}
        </motion.div>
      </main>

      {/* Right: History Panel */}
      <motion.aside
        initial={{ x: 320 }}
        animate={{ x: 0 }}
        className="hidden lg:block fixed right-0 top-16 md:top-[120px] bottom-14 w-[320px] bg-background border-l border-border z-10"
      >
        <HistoryPanel 
          clientId={selectedClientId}
          clientName={selectedClient?.name || null}
          activeModule={moduleParam}
          onSelectItem={handleHistoryItemSelect}
          selectedItemId={selectedHistoryItem?.id}
          refreshTrigger={refreshTrigger}
        />
      </motion.aside>

      <ClientModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onCreate={handleCreateClient} 
      />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AppPageContent />
    </Suspense>
  );
}
