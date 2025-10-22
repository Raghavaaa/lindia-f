"use client";

import React, { useState } from "react";
import { Scale, Upload, CheckCircle, AlertCircle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetchWithRetry, config, checkBackendHealth } from "@/lib/config";

type Props = {
  clientId: string;
  onComplete?: () => void;
};

export default function CaseModule({ clientId, onComplete }: Props) {
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [running, setRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [progressMessage, setProgressMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!caseTitle.trim()) {
      setErrorMessage("Please enter a case title");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!caseDetails.trim()) {
      setErrorMessage("Please enter case details");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    setRunning(true);
    setProgressMessage("Connecting to backend...");

    try {
      const isOnline = await checkBackendHealth();
      
      if (!isOnline) {
        throw new Error("Backend is offline. Please try again later.");
      }

      setProgressMessage("Preparing case documents...");

      const response = await apiFetchWithRetry(config.endpoints.case, {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId || 'demo',
          case_title: caseTitle.trim(),
          case_details: caseDetails.trim(),
        })
      }, config.timeouts.standard, 1);

      setProgressMessage(null);

      if (response.status === 501) {
        // Backend returns 501 Not Implemented
        setErrorMessage("Case Management feature is coming soon! Backend implementation is in progress.");
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      } else if (response.ok) {
        const data = await response.json();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        if (onComplete) onComplete();
      } else {
        throw new Error(`Backend returned ${response.status}`);
      }
    } catch (error) {
      setProgressMessage(null);
      const errMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errMsg.includes('REQUEST_TIMEOUT')) {
        setErrorMessage("Request timed out. Please try again.");
      } else if (errMsg.includes('NETWORK_ERROR') || errMsg.includes('offline')) {
        setErrorMessage("Backend is offline. Please try again later.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }

    setRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence>
        {progressMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
          >
            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
            <span className="text-sm font-medium">{progressMessage}</span>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Case Draft Ready!</p>
              <p className="text-sm opacity-90">Legal documents prepared successfully</p>
            </div>
          </motion.div>
        )}

        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Case Management
            </CardTitle>
            <CardDescription>
              Prepare case documents, petitions, and legal drafts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="case-title" className="text-sm font-medium">
                Case Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="case-title"
                placeholder="e.g., Property Dispute - XYZ vs ABC"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="case-details" className="text-sm font-medium">
                Case Details <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="case-details"
                placeholder="Describe the case facts, parties involved, relief sought..."
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Upload Supporting Documents</label>
              <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer group">
                <Upload className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-primary">
                  Click to upload case documents
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Evidence, precedents, and supporting files
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={running} 
                size="icon" 
                className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
                title={running ? "Processing..." : "Prepare Case Draft"}
              >
                {running ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {running ? "Processing..." : "Prepare Case Draft"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
