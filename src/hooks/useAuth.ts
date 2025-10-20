"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<{name?: string; email?: string; image?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user profile
    try {
      const profile = localStorage.getItem("legalindia_profile");
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUser(parsedProfile);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (provider?: string) => {
    // This is handled by the LoginForm component now
    console.log("Login called with provider:", provider);
  };

  const logout = async () => {
    // Clear localStorage
    localStorage.removeItem("legalindia_profile");
    localStorage.removeItem("legalindia_clients");
    
    // Clear any client-specific research data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('legalindia::client::') || key.startsWith('legalindia_clients_')) {
        localStorage.removeItem(key);
      }
    });
    
    setUser(null);
    // Redirect to home page
    window.location.href = "/";
  };

  const isAuthenticated = !!user;

  return {
    user,
    session: user ? { user } : null,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
