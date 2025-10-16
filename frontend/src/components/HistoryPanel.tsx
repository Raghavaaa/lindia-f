"use client";

import React, { useEffect, useState } from "react";
import { History, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

type HistoryItem = {
  id: string;
  title: string;
  query: string;
  adminPrompt?: string | null;
  resultText: string;
  ts: number;
};

type Props = {
  clientId: string | null;
  clientName: string | null;
  activeModule: string | null;
  onSelectItem: (item: HistoryItem) => void;
  selectedItemId?: string | null;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  refreshTrigger?: number;
};

export default function HistoryPanel({ 
  clientId, 
  clientName, 
  activeModule, 
  onSelectItem,
  selectedItemId,
  isMobileOpen = false,
  onMobileClose,
  refreshTrigger
}: Props) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [displayLimit, setDisplayLimit] = useState(50);

  useEffect(() => {
    console.log("HistoryPanel: useEffect triggered with clientId:", clientId, "activeModule:", activeModule, "refreshTrigger:", refreshTrigger);
    
    if (!clientId) {
      console.log("HistoryPanel: No clientId, setting empty history");
      setHistoryItems([]);
      return;
    }

    try {
      const key = `legalindia::client::${clientId}::research`;
      console.log("HistoryPanel: Looking for key:", key);
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const items: HistoryItem[] = JSON.parse(saved);
        console.log("HistoryPanel: Loaded items for key", key, "items:", items);
        setHistoryItems(items.slice(0, 100));
      } else {
        console.log("HistoryPanel: No data found for key", key);
        const allKeys = Object.keys(localStorage);
        const researchKeys = allKeys.filter(k => k.includes('research'));
        console.log("HistoryPanel: All research keys in localStorage:", researchKeys);
        setHistoryItems([]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setHistoryItems([]);
    }
  }, [clientId, refreshTrigger]);

  const displayedItems = historyItems.slice(0, displayLimit);
  const hasMore = historyItems.length > displayLimit;

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleItemClick = (item: HistoryItem) => {
    onSelectItem(item);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div className={`w-80 border-l border-border bg-card flex flex-col h-screen sticky top-0 ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </h3>
        </div>
        {clientName && (
          <p className="text-xs text-muted-foreground">
            Client: {clientName}
          </p>
        )}
        <Separator />
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {!clientId ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Select a client
          </div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No history yet
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-1">
              {displayedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.02 }}
                  layout
                >
                  <Button
                    variant={selectedItemId === item.id ? "default" : "ghost"}
                    className={`w-full justify-start h-auto py-3 px-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
                      selectedItemId === item.id 
                        ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg" 
                        : "hover:bg-accent hover:scale-105"
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex flex-col items-start gap-1 w-full text-left">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(item.ts)}</span>
                        <span>•</span>
                        <span>{new Date(item.ts).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm font-medium line-clamp-2 w-full">
                        {item.title}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-2"
              >
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setDisplayLimit(prev => prev + 50)}
                >
                  Load more...
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
