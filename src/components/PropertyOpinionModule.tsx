"use client";

import React, { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  clientId: string;
  onComplete?: () => void;
};

export default function PropertyOpinionModule({ clientId, onComplete }: Props) {
  const [specificConcerns, setSpecificConcerns] = useState("");
  const [running, setRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    setRunning(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setRunning(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
              <p className="font-semibold">Analysis Complete!</p>
              <p className="text-sm opacity-90">Property opinion generated successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div 
                className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer group relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-primary">
                  Click to upload documents
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag and drop files here
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Accepted: PDF, DOC, DOCX, TXT, JPG, PNG
                </p>
              </div>
              
              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Selected Files:</p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload Progress */}
              {running && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
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

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleAnalyze} 
                disabled={running} 
                size="icon" 
                className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
                title={running ? "Analyzing..." : "Analyze Property"}
              >
                {running ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {running ? "Analyzing..." : "Analyze Property"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
