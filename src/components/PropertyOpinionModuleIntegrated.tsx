"use client";

import React, { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadDocument, useRequestPropertyOpinion } from "@/hooks/api";
import { useApiToast } from "@/hooks/use-api-toast";

type Props = {
  clientId: string;
  onComplete?: () => void;
};

export default function PropertyOpinionModule({ clientId, onComplete }: Props) {
  const [specificConcerns, setSpecificConcerns] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([]);
  
  const uploadDocument = useUploadDocument();
  const requestOpinion = useRequestPropertyOpinion();
  const apiToast = useApiToast();

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

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      apiToast.warning('No Files', 'Please upload at least one document');
      return;
    }

    setUploadProgress(0);
    const loadingToast = apiToast.loading('Uploading documents...', 'This may take a moment');

    try {
      // Upload all files
      const uploadPromises = selectedFiles.map((file, index) => {
        return uploadDocument.mutateAsync({
          file,
          caseId: clientId,
          metadata: { type: 'property_document' }
        }).then((doc) => {
          setUploadProgress(((index + 1) / selectedFiles.length) * 50); // 50% for uploads
          return doc.id;
        });
      });

      const docIds = await Promise.all(uploadPromises);
      setUploadedDocIds(docIds);
      loadingToast.dismiss();

      // Request property opinion
      apiToast.loading('Analyzing documents...', 'AI is reviewing your property documents');
      
      await requestOpinion.mutateAsync({
        propertyId: clientId,
        address: specificConcerns,
        documents: docIds,
        checkType: 'full'
      });

      setUploadProgress(100);
      apiToast.success('Analysis Complete!', 'Property opinion generated successfully');
      
      if (onComplete) onComplete();
      
      // Reset form
      setSelectedFiles([]);
      setSpecificConcerns("");
      setUploadProgress(0);
    } catch (error) {
      loadingToast.dismiss();
      apiToast.error(error, 'Failed to analyze documents');
      setUploadProgress(0);
    }
  };

  const isLoading = uploadDocument.isPending || requestOpinion.isPending;

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
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary/50 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, or Images (max 10MB each)
                </p>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Specific Concerns or Address</label>
              <Textarea
                placeholder="Describe the property, specific concerns, or enter property address..."
                value={specificConcerns}
                onChange={(e) => setSpecificConcerns(e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || selectedFiles.length === 0}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Processing..." : "Analyze Property Documents"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

