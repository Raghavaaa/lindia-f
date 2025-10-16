"use client";

import React, { useState } from "react";
import { FileText, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

type Props = {
  clientId: string;
  onComplete?: () => void;
};

export default function PropertyOpinionModule({ clientId, onComplete }: Props) {
  const [specificConcerns, setSpecificConcerns] = useState("");
  const [running, setRunning] = useState(false);

  const handleAnalyze = () => {
    
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      alert("Property analysis complete! (Demo)");
      if (onComplete) onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Property Opinion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Upload Property Documents</label>
              <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer group">
                <Upload className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-primary">
                  Click to upload documents
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag and drop files here
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="concerns" className="text-sm font-medium">
                Specific Concerns (Optional)
              </label>
              <Textarea
                id="concerns"
                placeholder="Any specific legal concerns or questions..."
                value={specificConcerns}
                onChange={(e) => setSpecificConcerns(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleAnalyze} disabled={running} size="lg" className="w-full">
              {running ? "Analyzing..." : "Analyze Property"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
