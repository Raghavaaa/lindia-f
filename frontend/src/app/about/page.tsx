"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle className="text-3xl md:text-4xl font-heading">
                About LegalIndia.AI
              </CardTitle>
            </motion.div>
            <CardDescription className="text-base">
              AI-powered legal assistance for Indian lawyers
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-4">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground leading-relaxed"
            >
              LegalIndia.AI provides lawyer-first tools for Property Opinions, Legal Research,
              Case Management and a Junior AI assistant tailored for Indian legal practice.
              The product focuses on fast, reliable outputs and a clean, secure workflow
              for practicing lawyers.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground leading-relaxed"
            >
              This interface is front-end only — all research and inference connect to our
              backend AI engine. Use the app for quick drafts, client management, and
              structured legal research.
            </motion.p>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="gap-2 group">
                <Link href="/login">
                  Proceed to App
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
