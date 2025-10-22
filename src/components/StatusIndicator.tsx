"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { checkBackendHealth, isBackendConfigured } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

export default function StatusIndicator() {
  const [status, setStatus] = useState<"online" | "offline" | "unconfigured">("offline");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!isBackendConfigured()) {
        setStatus("unconfigured");
        setChecking(false);
        return;
      }

      const isHealthy = await checkBackendHealth();
      setStatus(isHealthy ? "online" : "offline");
      setChecking(false);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  if (checking) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        {status === "online" && (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-pulse-slow">
            <Wifi className="w-4 h-4" />
            <span>Backend Connected</span>
          </div>
        )}
        {status === "offline" && (
          <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode</span>
          </div>
        )}
        {status === "unconfigured" && (
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
            <AlertCircle className="w-4 h-4" />
            <span>Backend Not Configured</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

