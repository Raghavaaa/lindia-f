"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch, config, checkBackendHealth } from "@/lib/config";
import { addToQueue } from "@/lib/offline-queue";

type Props = {
  clientId: string;
  onComplete?: () => void;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export default function JuniorModule({ clientId, onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = input;
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const isOnline = await checkBackendHealth();
      
      if (!isOnline) {
        throw new Error("Backend is offline. Working in offline mode.");
      }

      const response = await apiFetch(config.endpoints.junior, {
        method: 'POST',
        body: JSON.stringify({
          query: queryText,
          context: 'AI Legal Junior Assistant - comprehensive legal analysis',
          tenant_id: clientId || 'demo'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer || data.ai_response || data.result || `I understand your query about "${queryText}". Let me provide comprehensive legal guidance on this matter.`,
          timestamp: Date.now(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(`Backend returned ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('NETWORK_ERROR') || errorMessage.includes('offline')) {
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Legal Guidance: ${queryText}

**Offline Mode - Limited Functionality**

I understand your legal query. Since the backend is currently unreachable, here's a basic guidance framework:

**Legal Analysis Framework:**
This query relates to Indian legal provisions and procedures. Here's how I can help when connection is restored:

**Research Capabilities:**
- Case law analysis and precedents
- Statutory provisions and amendments
- Legal procedures and requirements
- Court processes and timelines

**Drafting Support:**
- Legal document preparation
- Contract analysis and drafting
- Pleading and petition drafting
- Legal opinion preparation

**Analysis Services:**
- Case summary and analysis
- Legal risk assessment
- Compliance requirements
- Procedural guidance

Your query will be processed when backend connection is restored.

[Offline Mode - Full assistance available when connection is restored]`,
          timestamp: Date.now(),
        };
        
        setMessages((prev) => [...prev, fallbackMessage]);
        addToQueue(config.endpoints.junior, 'POST', {
          query: queryText,
          context: 'AI Legal Junior Assistant - comprehensive legal analysis',
          tenant_id: clientId || 'demo'
        });
        
        setError("Working offline. Queries will sync when connection is restored.");
        setTimeout(() => setError(null), 5000);
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I encountered an error processing your query. Please try again or contact support if the problem persists.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    }

    setIsTyping(false);
    if (onComplete) onComplete();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <AnimatePresence>
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

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Legal Junior
            </CardTitle>
            <CardDescription>
              Your AI assistant for legal research, drafting, and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg min-h-0">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ask me anything about Indian law, case research, or legal drafting...</p>
                </div>
              )}
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-card border rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="space-y-2 flex-shrink-0">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about case law, statutes, or legal procedures..."
                  rows={3}
                  className="flex-1"
                  disabled={isTyping}
                  aria-label="Message input"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    title="Upload documents"
                    disabled
                    aria-label="Upload documents (coming soon)"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    size="icon"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
