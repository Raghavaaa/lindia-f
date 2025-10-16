"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Loader2, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type ResearchItem = {
  id: string;
  title: string;
  query: string;
  adminPrompt?: string | null;
  resultText: string;
  ts: number;
};

type Props = {
  clientId: string;
  onResearchComplete?: () => void;
};

export default function ResearchModule({ clientId, onResearchComplete }: Props) {
  const [query, setQuery] = useState("");
  const [adminPrompt, setAdminPrompt] = useState("Use Indian case law & statutes where relevant. Summarize in 5 bullet points.");
  const [showAdmin, setShowAdmin] = useState(false);
  const [running, setRunning] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleanup old localStorage data on component mount
  useEffect(() => {
    try {
      const keys = Object.keys(localStorage);
      const researchKeys = keys.filter(key => key.startsWith('legalindia::client::') && key.endsWith('::research'));
      
      researchKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          const items = JSON.parse(data);
          if (items.length > 50) {
            localStorage.setItem(key, JSON.stringify(items.slice(0, 50)));
          }
        }
      });
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }, []);

  // Handle Enter key to run research
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && textareaRef.current === document.activeElement) {
        e.preventDefault();
        runResearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [query, adminPrompt, showAdmin]);

  function runResearch() {
    if (!query.trim()) {
      alert("Enter a research query.");
      return;
    }

    setRunning(true);

    setTimeout(() => {
      const resultText = `Research Summary for: "${query}"

Key Findings:
• This is a demo research result showing the format
• Indian case law analysis would appear here
• Relevant statutes and precedents would be cited
• Practical implications for the client would be outlined
• Next steps and recommendations would be provided

${adminPrompt && showAdmin ? `\n(Admin prompt applied: ${adminPrompt})` : ""}`;

      const queryText = query.trim();
      const newItem: ResearchItem = {
        id: uuidv4(),
        title: queryText.substring(0, 60) + (queryText.length > 60 ? "..." : ""),
        query: queryText,
        adminPrompt: showAdmin ? adminPrompt.trim() : null,
        resultText,
        ts: Date.now()
      };

      try {
        const key = `legalindia::client::${clientId}::research`;
        const existing = localStorage.getItem(key);
        const items: ResearchItem[] = existing ? JSON.parse(existing) : [];
        
        const updatedItems = [newItem, ...items].slice(0, 50);
        
        const dataSize = JSON.stringify(updatedItems).length;
        if (dataSize > 50000) {
          const trimmedItems = updatedItems.slice(0, 25);
          localStorage.setItem(key, JSON.stringify(trimmedItems));
        } else {
          localStorage.setItem(key, JSON.stringify(updatedItems));
        }
        
        console.log("ResearchModule: Saved to key", key, "items:", updatedItems);
        setQuery("");
        
        if (onResearchComplete) {
          onResearchComplete();
        }
        
        setShowSavedToast(true);
        setTimeout(() => setShowSavedToast(false), 3000);
      } catch (error) {
        console.error("Error saving research:", error);
        try {
          const key = `legalindia::client::${clientId}::research`;
          localStorage.removeItem(key);
          localStorage.setItem(key, JSON.stringify([newItem]));
          setQuery("");
          setShowSavedToast(true);
          setTimeout(() => setShowSavedToast(false), 3000);
        } catch (retryError) {
          console.error("Failed to save even after cleanup:", retryError);
          alert("Saving disabled - localStorage is full. Please clear browser data or use incognito mode.");
        }
      }

      setRunning(false);
    }, 1000);
  }

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Saved Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">
              Saved • {formatTime(Date.now())}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Legal Research
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            placeholder="Enter your legal research question (e.g., 'What are the requirements for adverse possession in urban properties under Indian law?')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[120px] resize-y"
            aria-label="Research query input"
          />
          <p className="text-xs text-muted-foreground">
            Press Enter to run research
          </p>
        </div>

        {/* Admin Prompt Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            id="showAdmin"
            checked={showAdmin}
            onCheckedChange={setShowAdmin}
          />
          <label htmlFor="showAdmin" className="text-sm text-muted-foreground cursor-pointer">
            Show admin prompt
          </label>
        </div>

        {/* Admin Prompt Textarea */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Textarea
                value={adminPrompt}
                onChange={(e) => setAdminPrompt(e.target.value)}
                className="min-h-[80px] resize-y"
                placeholder="Admin prompt..."
                aria-label="Admin prompt for research customization"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Run Button */}
        <div className="flex justify-center mt-8">
          <div className="text-center">
            <Button
              onClick={runResearch}
              disabled={running}
              size="icon"
              className="w-24 h-24 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-primary/30 relative z-10"
              title={running ? "Running..." : "Run Research"}
            >
              {running ? (
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-10 h-10" />
              )}
            </Button>
            <p className="text-center text-base text-foreground mt-4 font-semibold">
              {running ? "Running..." : "Run Research"}
            </p>
          </div>
        </div>
          </CardContent>
        </Card>
      </motion.div>
      
    </div>
  );
}
