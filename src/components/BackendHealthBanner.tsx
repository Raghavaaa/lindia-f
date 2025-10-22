"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { checkBackendHealth, config } from "@/lib/config";

export default function BackendHealthBanner() {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        setHealthStatus(isHealthy ? 'healthy' : 'unhealthy');
        setIsVisible(!isHealthy); // Show banner only when unhealthy
      } catch (error) {
        setHealthStatus('unhealthy');
        setIsVisible(true);
      }
    };

    // Check immediately
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {healthStatus === 'checking' ? (
            <Loader2 className="h-5 w-5 text-red-400 animate-spin" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Backend not connected
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              Unable to reach backend at: <code className="bg-red-100 px-1 rounded">{config.apiBase}</code>
            </p>
            <p className="mt-1">
              Some features may not work properly. Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
