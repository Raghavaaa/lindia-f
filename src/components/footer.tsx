"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-center h-14 px-4">
          <p className="text-sm text-muted-foreground">
            © 2025 LegalIndia.AI. All Rights Reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
