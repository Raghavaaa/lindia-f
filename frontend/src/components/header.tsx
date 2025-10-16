"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Settings, Info, Building2, Search, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

            {/* Right side: About and Settings */}
            <div className="flex items-center gap-3">
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
