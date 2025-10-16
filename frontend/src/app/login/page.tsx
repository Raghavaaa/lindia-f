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
  const router = useRouter();

  function simulateGoogleSignIn() {
    setStage("form");
    setName("");
  }

  function handleContinue() {
    if (!name.trim()) return alert("Enter name");
    if (!phone.trim()) return alert("Enter phone");
    
    const profile = { name, address, phone };
    try {
      localStorage.setItem("legalindia_profile", JSON.stringify(profile));
    } catch {}
    router.push("/app");
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
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Office / City"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                  />
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
