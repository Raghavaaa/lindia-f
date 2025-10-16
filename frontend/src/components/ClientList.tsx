"use client";

import React, { useEffect, useRef } from "react";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

type Client = {
  id: string;
  name: string;
  phone?: string;
};

type Props = {
  clients: Client[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onOpenNew: () => void;
};

export default function ClientList({ clients, selectedId, onSelect, onOpenNew }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIndex = clients.findIndex(c => c.id === selectedId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!listRef.current?.contains(document.activeElement)) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(selectedIndex + 1, clients.length - 1);
        if (clients[nextIndex]) onSelect(clients[nextIndex].id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(selectedIndex - 1, 0);
        if (clients[prevIndex]) onSelect(clients[prevIndex].id);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedId) onSelect(selectedId);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, clients, selectedId, onSelect]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Clients
          </h2>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onOpenNew}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="w-3 h-3" />
            New
          </Button>
        </div>
        
        <Separator />
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {clients.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No clients yet
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-1">
              {clients.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Button
                    variant={selectedId === c.id ? "default" : "ghost"}
                    className={`w-full justify-start h-auto py-2 px-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
                      selectedId === c.id 
                        ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg" 
                        : "hover:bg-accent hover:scale-105"
                    }`}
                    onClick={() => onSelect(c.id)}
                    tabIndex={0}
                  >
                    <div className="flex flex-col items-start gap-0.5 w-full text-left">
                      <div className="text-sm font-medium truncate w-full">
                        {c.name}
                      </div>
                      {c.phone && (
                        <div className="text-xs text-muted-foreground">
                          {c.phone}
                        </div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
