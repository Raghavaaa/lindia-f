"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [stage, setStage] = useState<"start" | "form">("start");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{name?: string; phone?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function simulateGoogleSignIn() {
    setStage("form");
    setName("");
  }

  // Validation functions for international standards
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  async function handleContinue() {
    setIsSubmitting(true);
    const newErrors: {name?: string; phone?: string} = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!validateName(name)) {
      newErrors.name = "Name must be 2-100 characters long";
    }

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
    
    const profile = { name: name.trim(), address: address.trim(), phone: phone.trim() };
    try {
      localStorage.setItem("legalindia_profile", JSON.stringify(profile));
      router.push("/app");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-heading">Login</CardTitle>
            <CardDescription>
              {stage === "start" 
                ? "Sign in to access your legal workspace" 
                : "Complete your lawyer profile"}
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {stage === "start" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <p className="text-sm text-muted-foreground text-center">
                  Sign in with Google to continue (UI-only simulation).
                </p>

                <Button
                  onClick={simulateGoogleSignIn}
                  variant="outline"
                  className="w-full gap-3"
                  size="lg"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setStage("form")}
                    className="w-full gap-2"
                    size="lg"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Link href="/">
                      <Home className="w-4 h-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {stage === "form" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  For Lawyers — Please complete your details.
                </p>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Enter your full legal name"
                      className={`pr-10 ${errors.name ? 'border-destructive focus:border-destructive' : ''}`}
                      aria-label="Full name"
                      aria-describedby={errors.name ? "name-error" : undefined}
                      aria-invalid={!!errors.name}
                      autoComplete="name"
                    />
                    {name && validateName(name) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500">
                        ✓
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <div id="name-error" className="text-sm text-destructive">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Office Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your office address or city"
                    aria-label="Office address"
                    autoComplete="address-line1"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+1 234 567 8900"
                      className={`pr-10 ${errors.phone ? 'border-destructive focus:border-destructive' : ''}`}
                      aria-label="Phone number"
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      aria-invalid={!!errors.phone}
                      autoComplete="tel"
                    />
                    {phone && validatePhone(phone) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500">
                        ✓
                      </div>
                    )}
                  </div>
                  {errors.phone && (
                    <div id="phone-error" className="text-sm text-destructive">
                      {errors.phone}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter international format: +1 234 567 8900 or 1234567890
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  All data is stored locally (front-end only).
                </p>
              </motion.div>
            )}
          </CardContent>

          {stage === "form" && (
            <>
              <Separator />
              <CardFooter className="flex gap-3 pt-6">
                <Button
                  onClick={handleContinue}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  Continue to App
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setStage("start")}
                  variant="outline"
                  size="lg"
                >
                  Back
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
