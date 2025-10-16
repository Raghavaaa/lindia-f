"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import ModulePills from "./ModulePills";
import ResearchModule from "./ResearchModule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

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
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
      {/* Client chip */}
      {client && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
        >
          <User className="w-4 h-4" />
          Client: {client.name}
        </motion.div>
      )}

      {/* Module content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
        {/* Left side - Prompt window */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Client Selection Dropdown */}
          <div className="space-y-2 max-w-md">
            <label htmlFor="client-select" className="text-sm font-medium text-foreground">
              Select Client
            </label>
            <Select
              value={selectedClientId || ""}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger id="client-select" className="w-full">
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {allClients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ResearchModule 
            clientId={selectedClientId || client?.id || ""}
            onResearchComplete={onResearchComplete}
          />
        </motion.div>

        {/* Right side - Module pills */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-20 lg:self-start"
        >
          <ModulePills activeModule={activeModule} onSelect={onModuleChange} />
        </motion.div>
      </div>
    </div>
  );
}
