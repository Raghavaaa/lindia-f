"use client";

import React, { useState } from "react";
import { Scale, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

type Props = {
  clientId: string;
  onComplete?: () => void;
};

export default function CaseModule({ clientId, onComplete }: Props) {
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [running, setRunning] = useState(false);

  const handleSubmit = () => {
    if (!caseTitle.trim()) {
      alert("Please enter case title");
      return;
    }
    
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      alert("Case draft prepared! (Demo)");
      if (onComplete) onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              <label className="text-sm font-medium">Upload Supporting Documents</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload case documents, evidence, precedents
                </p>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={running} size="lg" className="w-full">
              {running ? "Processing..." : (<><Send className="w-4 h-4 mr-2" />Prepare Case Draft</>)}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
