"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/client-service";
import { useToast } from "@/hooks/use-toast";

export default function ClientModal({ 
  open, 
  onClose, 
  onCreate 
}: { 
  open: boolean; 
  onClose: () => void; 
  onCreate: (c: { name: string; phone?: string }) => void; 
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{name?: string; phone?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  // Phone number validation for international standards
  const validatePhone = (phone: string): boolean => {
    // International phone number regex (supports various formats)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    // Remove spaces, dashes, parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    const newErrors: {name?: string; phone?: string} = {};

    // Validate name
    if (!validateName(name)) {
      newErrors.name = "Name must be 2-100 characters long";
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid international phone number (10-15 digits)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create client via backend API
      const newClient = await createClient({ 
        name: name.trim(), 
        phone: phone.trim() 
      });
      
      // Call the parent callback with the created client
      await onCreate(newClient);
      
      // Show success toast
      toast({
        title: "Client created successfully",
        description: `${newClient.name} has been added to your workspace.`,
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      
      // Show error toast
      toast({
        title: "Failed to create client",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-heading text-xl">Create New Client</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new client to your workspace. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-6"
        >
          <div className="space-y-3">
            <label htmlFor="client-name" className="text-sm font-semibold text-foreground">
              Client Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                id="client-name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter full client name"
                autoFocus
                className={`pr-10 ${errors.name ? 'border-destructive focus:border-destructive' : ''}`}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
              />
              {name && validateName(name) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            {errors.name && (
              <div id="name-error" className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="client-phone" className="text-sm font-semibold text-foreground">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                id="client-phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+1 234 567 8900"
                className={`pr-10 ${errors.phone ? 'border-destructive focus:border-destructive' : ''}`}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                aria-invalid={!!errors.phone}
              />
              {phone && validatePhone(phone) && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            {errors.phone && (
              <div id="phone-error" className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Enter international format: +1 234 567 8900 or 1234567890
            </p>
          </div>
        </motion.div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={isSubmitting || !name.trim() || !phone.trim()}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
