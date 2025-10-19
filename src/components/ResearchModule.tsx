"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Loader2, Check, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, config, checkBackendHealth } from "@/lib/config";
import { addToQueue } from "@/lib/offline-queue";
import ResearchResultsModal from "./ResearchResultsModal";

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
  const [error, setError] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [researchResults, setResearchResults] = useState<ResearchItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentResult, setCurrentResult] = useState<ResearchItem | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const key = `legalindia::client::${clientId}::research`;
      const data = localStorage.getItem(key);
      if (data) {
        const items = JSON.parse(data);
        setResearchResults(items);
      }
    } catch (error) {
      // Ignore localStorage errors
    }
  }, [clientId]);

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
      // Ignore cleanup errors
    }
  }, []);

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

  const saveToLocal = (item: ResearchItem) => {
    try {
      const key = `legalindia::client::${clientId}::research`;
      const existing = localStorage.getItem(key);
      const items: ResearchItem[] = existing ? JSON.parse(existing) : [];
      
      const updatedItems = [item, ...items].slice(0, 50);
      
      const dataSize = JSON.stringify(updatedItems).length;
      if (dataSize > 50000) {
        const trimmedItems = updatedItems.slice(0, 25);
        localStorage.setItem(key, JSON.stringify(trimmedItems));
      } else {
        localStorage.setItem(key, JSON.stringify(updatedItems));
      }
      
      setResearchResults(updatedItems);
      setCurrentResult(item);
      setShowResults(true);
      setShowResultsModal(true);
    } catch (error) {
      // Try to recover from localStorage quota error
      try {
        const key = `legalindia::client::${clientId}::research`;
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify([item]));
        setResearchResults([item]);
        setCurrentResult(item);
        setShowResults(true);
        setShowResultsModal(true);
      } catch (retryError) {
        setError("Unable to save locally. Storage may be full.");
      }
    }
  };

  const saveToBackend = async (item: ResearchItem) => {
    try {
      const isOnline = await checkBackendHealth();
      if (!isOnline) {
        addToQueue(config.endpoints.storage, 'POST', {
          clientId,
          type: 'research',
          data: item,
        });
        return;
      }

      await apiFetch(config.endpoints.storage, {
        method: 'POST',
        body: JSON.stringify({
          clientId,
          type: 'research',
          data: item,
        }),
      });
    } catch (error) {
      addToQueue(config.endpoints.storage, 'POST', {
        clientId,
        type: 'research',
        data: item,
      });
    }
  };

  async function runResearch() {
    if (!query.trim()) {
      setError("Please enter a research query.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setRunning(true);
    setError(null);

    try {
      const isOnline = await checkBackendHealth();
      
      if (!isOnline) {
        throw new Error("Backend is offline. Working in offline mode.");
      }

      const response = await apiFetch(config.endpoints.research, {
        method: 'POST',
        body: JSON.stringify({
          query: query.trim(),
          context: showAdmin && adminPrompt ? adminPrompt : 'Legal research query',
          tenant_id: clientId || 'demo'
        })
      });

      let resultText: string;

      if (response.ok) {
        const data = await response.json();
        resultText = data.answer || data.ai_response || data.result || `Research completed for: "${query}"`;
      } else {
        throw new Error(`Backend returned ${response.status}`);
      }

      const queryText = query.trim();
      const newItem: ResearchItem = {
        id: uuidv4(),
        title: queryText.substring(0, 60) + (queryText.length > 60 ? "..." : ""),
        query: queryText,
        adminPrompt: showAdmin ? adminPrompt.trim() : null,
        resultText,
        ts: Date.now()
      };

      saveToLocal(newItem);
      await saveToBackend(newItem);
      
      setQuery("");
      
      if (onResearchComplete) {
        onResearchComplete();
      }
      
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('NETWORK_ERROR') || errorMessage.includes('offline')) {
        const fallbackResult = `Research Summary for: "${query}"

**Offline Mode - Limited Functionality**

This query relates to Indian legal provisions and procedures. Since the backend is currently unreachable, here's a basic research framework:

**Legal Analysis Framework:**
- Statutory provisions and amendments
- Case law analysis and precedents
- Legal procedures and requirements
- Court processes and timelines

**Research Methodology:**
- Database searches for relevant cases
- Statutory analysis and interpretation
- Legal commentary and expert opinions
- Practical application guidance

**Key Considerations:**
- Legal requirements and compliance
- Documentation and evidence needs
- Procedural steps and timelines
- Risk assessment and mitigation

**Next Steps:**
1. Detailed case law research
2. Statutory analysis
3. Practical procedure guidance
4. Risk assessment and recommendations

${adminPrompt && showAdmin ? `\n\n(Enhanced with admin context: ${adminPrompt})` : ""}

[Offline Mode - Full research available when backend connection is restored]`;

        const queryText = query.trim();
        const newItem: ResearchItem = {
          id: uuidv4(),
          title: queryText.substring(0, 60) + (queryText.length > 60 ? "..." : ""),
          query: queryText,
          adminPrompt: showAdmin ? adminPrompt.trim() : null,
          resultText: fallbackResult,
          ts: Date.now()
        };

        saveToLocal(newItem);
        addToQueue(config.endpoints.research, 'POST', {
          query: queryText,
          context: showAdmin && adminPrompt ? adminPrompt : 'Legal research query',
          tenant_id: clientId || 'demo'
        });

        setQuery("");
        
        if (onResearchComplete) {
          onResearchComplete();
        }
        
        setError("Working offline. Results will sync when connection is restored.");
        setTimeout(() => setError(null), 5000);
      } else {
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    }

    setRunning(false);
  }

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
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
                <Loader2 className="w-10 h-10 animate-spin" />
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

      {researchResults.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Research Results ({researchResults.length})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResults(!showResults)}
                >
                  {showResults ? 'Hide' : 'Show'} Results
                </Button>
              </CardTitle>
            </CardHeader>
            {showResults && (
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {researchResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentResult?.id === result.id 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-muted/50 border-border hover:bg-muted/70'
                      }`}
                      onClick={() => setCurrentResult(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{result.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.query}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(result.ts)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {currentResult && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold mb-3 text-primary">
                      Research Result: {currentResult.title}
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {currentResult.resultText}
                      </pre>
                    </div>
                    {currentResult.adminPrompt && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-800 mb-1">Admin Prompt:</p>
                        <p className="text-xs text-blue-700">{currentResult.adminPrompt}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>
      )}

      {/* Research Results Modal */}
      <ResearchResultsModal
        open={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        result={currentResult}
      />
      
    </div>
  );
}
