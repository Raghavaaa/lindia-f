"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Settings, Info, Building2, Search, FileText, Bot, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const modules = [
  { id: "property", label: "Property Opinion", icon: Building2, path: "/app?module=property" },
  { id: "research", label: "Research", icon: Search, path: "/app?module=research" },
  { id: "case", label: "Case", icon: FileText, path: "/app?module=case" },
  { id: "junior", label: "Junior", icon: Bot, path: "/app?module=junior" }
];

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAppPage = pathname === "/app";
  const { user, isAuthenticated, logout } = useAuth();
  const [lawyerProfile, setLawyerProfile] = useState<{name?: string; email?: string} | null>(null);

  // Get lawyer profile from localStorage (for manual login)
  useEffect(() => {
    try {
      const profile = localStorage.getItem("legalindia_profile");
      if (profile && !isAuthenticated) {
        const parsedProfile = JSON.parse(profile);
        setLawyerProfile(parsedProfile);
      } else if (isAuthenticated) {
        // Clear localStorage profile when using Google Auth
        setLawyerProfile(null);
      }
    } catch (error) {
      // Handle error silently
    }
  }, [isAuthenticated]);

  // Enhanced logout function that clears all client data
  const handleLogout = async () => {
    try {
      // Clear all client-related data
      localStorage.removeItem("legalindia_clients");
      localStorage.removeItem("legalindia_profile");
      
      // Clear any client-specific research data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('legalindia::client::') || key.startsWith('legalindia_clients_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Call the original logout function
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      // Still call logout even if cleanup fails
      await logout();
    }
  };

  // Get display name (prioritize Google Auth over localStorage)
  const displayName = isAuthenticated 
    ? (user?.name || user?.email) 
    : (lawyerProfile?.name || lawyerProfile?.email);
  const isLoggedIn = isAuthenticated || lawyerProfile;
  const currentModule = searchParams.get("module") || "research";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
              >
                L
              </motion.div>
              <span className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                LegalIndia.AI
              </span>
            </Link>

            {/* Right side: Lawyer name, About and Settings */}
            <div className="flex items-center gap-3">
              {isLoggedIn && displayName ? (
                <>
                  {/* Lawyer Name Display */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                  </div>
                  
                  {/* Logout Button (only for Google Auth) */}
                  {isAuthenticated && (
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <Link href="/login">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
              )}

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Link href="/about">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">About</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Module Pills - Only show on /app page */}
      {isAppPage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-end h-14 px-4 gap-2">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Button
                      asChild
                      variant={currentModule === module.id ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 font-semibold transition-all duration-200 ${
                        currentModule === module.id 
                          ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105" 
                          : "hover:bg-accent hover:shadow-md hover:scale-105"
                      }`}
                    >
                      <Link href={module.path}>
                        <Icon className={`w-4 h-4 ${currentModule === module.id ? "text-primary-foreground" : "text-primary"}`} />
                        <span className="hidden md:inline">{module.label}</span>
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
