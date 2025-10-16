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
  const [propertyAddress, setPropertyAddress] = useState("");
  const [specificConcerns, setSpecificConcerns] = useState("");
  const [running, setRunning] = useState(false);

  const handleAnalyze = () => {
    if (!propertyAddress.trim()) {
      alert("Please enter property address");
      return;
    }
    
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
            <CardDescription>
              Get comprehensive legal opinion on property titles and documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="property-address" className="text-sm font-medium">
                Property Address <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="property-address"
                placeholder="Enter complete property address with survey numbers..."
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Property Documents</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload Sale Deed, EC, Tax Receipts, Survey Maps
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
              {running ? "Analyzing..." : (<><Send className="w-4 h-4 mr-2" />Analyze Property</>)}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
