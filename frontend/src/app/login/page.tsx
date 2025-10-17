"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      alert("Please enter a JWT token");
      return;
    }

    setIsLoading(true);
    
    try {
      // Save token to localStorage
      setAuthToken(token.trim());
      
      // Show success message
      console.log("✅ Token saved successfully!");
      
      // Redirect to app
      router.push("/app");
    } catch (error) {
      console.error("Error saving token:", error);
      alert("Failed to save token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevMode = () => {
    // For development: use a test token
    const devToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMTIzIiwidXNlcl9pZCI6InRlc3RfdXNlcl8xMjMiLCJpYXQiOjE3NjA3MDI1MjcsImVtYWlsIjoidGVzdF91c2VyXzEyM0B0ZXN0LmNvbSIsInRlc3QiOnRydWUsImV4cCI6MTc2MzI5NDUyN30.iMLxMAzmtUvImGCHV4wuI2LlBoyVHCJbe1cHR0mHCCs";
    setToken(devToken);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              LegalIndia.AI
            </h1>
            <p className="text-muted-foreground">
              Enter your JWT token to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-foreground mb-2">
                JWT Token
              </label>
              <textarea
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                rows={6}
                required
              />
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold"
              >
                {isLoading ? "Logging in..." : "Login to Dashboard"}
              </Button>

              <Button
                type="button"
                onClick={handleDevMode}
                variant="outline"
                className="w-full"
              >
                Use Dev Token
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>How to get a token:</strong>
              <br />
              1. Run: <code className="bg-background px-1 py-0.5 rounded">python3 legalindia-backend/generate_token.py</code>
              <br />
              2. Copy the generated token
              <br />
              3. Paste it above and click "Login"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
