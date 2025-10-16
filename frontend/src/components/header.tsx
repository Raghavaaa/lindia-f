"use client";

import React from "react";
import Link from "next/link";
import { Settings, Menu, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            {/* About Button */}
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

            {/* Settings Button */}
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

            {/* Mobile menu icon */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
