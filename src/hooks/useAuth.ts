"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState<{name?: string; email?: string; image?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user profile (fallback for demo mode)
    try {
      const profile = localStorage.getItem("legalindia_profile");
      if (profile && !session) {
        const parsedProfile = JSON.parse(profile);
        setLocalUser(parsedProfile);
      } else if (session) {
        // Clear localStorage profile when using Google Auth
        setLocalUser(null);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const login = async (provider?: string) => {
    if (provider === 'google') {
      await signIn('google', { callbackUrl: '/app' });
    } else {
      // Handle other providers or fallback
      console.log("Login called with provider:", provider);
    }
  };

  const logout = async () => {
    // Clear user-specific data from localStorage
    const currentUser = session?.user || localUser;
    if (currentUser?.email) {
      const userEmail = currentUser.email;
      // Clear user-specific clients
      localStorage.removeItem(`legalindia_clients_${userEmail}`);
      
      // Clear any client-specific research data for this user
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('legalindia::client::') && key.includes(userEmail)) {
          localStorage.removeItem(key);
        }
      });
    }
    
    if (session) {
      // Use NextAuth signOut for Google Auth
      await signOut({ callbackUrl: '/' });
    } else {
      // Clear localStorage for demo mode
      localStorage.removeItem("legalindia_profile");
      localStorage.removeItem("legalindia_clients");
      
      // Clear any remaining client-specific research data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('legalindia::client::') || key.startsWith('legalindia_clients_')) {
          localStorage.removeItem(key);
        }
      });
      
      setLocalUser(null);
      // Redirect to home page
      window.location.href = "/";
    }
  };

  // Use NextAuth session if available, otherwise fall back to localStorage
  const user = session?.user || localUser;
  const isAuthenticated = !!user;
  const isLoadingAuth = status === "loading" || isLoading;

  return {
    user,
    session: session || (localUser ? { user: localUser } : null),
    isAuthenticated,
    isLoading: isLoadingAuth,
    login,
    logout,
  };
}
