"use client";

import React from "react";
import { X, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

type ResearchItem = {
  id: string;
  title: string;
  query: string;
  adminPrompt?: string | null;
  resultText: string;
  ts: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  result: ResearchItem | null;
};

export default function ResearchResultsModal({ open, onClose, result }: Props) {
  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.resultText);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result.resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-${result.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Research Results
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Result Header */}
          <div className="flex-shrink-0 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Query:</strong> {result.query}</p>
              <p><strong>Generated:</strong> {formatTime(result.ts)}</p>
              {result.adminPrompt && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-800 mb-1">Admin Prompt:</p>
                  <p className="text-xs text-blue-700">{result.adminPrompt}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Results Content */}
          <div className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-sm max-w-none p-4 bg-background rounded-lg border"
            >
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {result.resultText}
              </pre>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
