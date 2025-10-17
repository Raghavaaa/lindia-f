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
import { motion } from "framer-motion";
import { listClients, createClient, type Client as APIClient } from "@/lib/api/client-api";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch clients from backend API
  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        const response = await listClients({ is_active: true });
        
        // Convert backend format to frontend format
        const formattedClients: Client[] = response.clients.map((c: APIClient) => ({
          id: c.client_id,
          name: c.name,
          phone: c.phone || undefined,
        }));
        
        setClients(formattedClients);
      } catch (error) {
        console.error("Error fetching clients from API:", error);
        
        // Fallback to localStorage if API fails (for offline support)
        try {
          const raw = localStorage.getItem("legalindia_clients");
          if (raw) {
            const clientsData = JSON.parse(raw);
            setClients(clientsData);
          }
        } catch (localError) {
          console.error("Error loading clients from localStorage:", localError);
        }
        
        toast({
          title: "Connection Issue",
          description: "Could not load clients from server. Showing cached data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [toast]);

  // Backup to localStorage (for offline support)
  useEffect(() => {
    try {
      localStorage.setItem("legalindia_clients", JSON.stringify(clients));
    } catch (error) {
      console.error("Error saving clients to localStorage:", error);
    }
  }, [clients]);

  async function handleCreateClient(c: { name: string; phone?: string }) {
    try {
      // Create client via API
      const newClient = await createClient({
        name: c.name,
        phone: c.phone || undefined,
      });
      
      // Add to local state
      const formattedClient: Client = {
        id: newClient.client_id,
        name: newClient.name,
        phone: newClient.phone || undefined,
      };
      
      setClients((prev) => [formattedClient, ...prev]);
      setSelectedClientId(formattedClient.id);
      
      toast({
        title: "Client Created",
        description: `${newClient.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error creating client:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not create client",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative pt-16 md:pt-[120px]">
      {/* Left: Client List */}
      <motion.aside
        initial={{ x: -220 }}
        animate={{ x: 0 }}
        className="w-[220px] border-r border-border bg-background shrink-0 hidden md:block fixed left-0 top-16 md:top-[120px] bottom-14 overflow-y-auto"
      >
        <ClientList 
          clients={clients} 
          selectedId={selectedClientId} 
          onSelect={handleSelectClient} 
          onOpenNew={() => setShowModal(true)} 
        />
      </motion.aside>

      {/* Center: Module Workspace */}
      <main className="flex-1 bg-background min-w-0 md:ml-[220px] md:mr-[320px] p-6">
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold mb-6 shadow-sm"
          >
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Client: {selectedClient.name}
          </motion.div>
        )}
        
        <motion.div
          key={moduleParam}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderModule()}
        </motion.div>
      </main>

      {/* Right: History Panel */}
      <motion.aside
        initial={{ x: 320 }}
        animate={{ x: 0 }}
        className="hidden lg:block fixed right-0 top-16 md:top-[120px] bottom-14 w-[320px] bg-background border-l border-border"
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
