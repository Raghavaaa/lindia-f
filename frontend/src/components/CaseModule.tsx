"use client";

import React, { useState } from "react";
import { Scale, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleSubmit = () => {
    if (!caseTitle.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      if (onComplete) onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Popup */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Error Popup */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">Missing Information</p>
              <p className="text-sm opacity-90">Please enter a case title</p>
            </div>
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
