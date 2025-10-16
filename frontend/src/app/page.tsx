"use client";

import Link from "next/link";
import { Building2, Search, FileText, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const modules = [
  { 
    id: "property", 
    label: "Property Opinion", 
    icon: Building2,
    description: "Get instant property title analysis"
  },
  { 
    id: "research", 
    label: "Research", 
    icon: Search,
    description: "Legal research powered by AI"
  },
  { 
    id: "case", 
    label: "Case", 
    icon: FileText,
    description: "Case law analysis & precedents"
  },
  { 
    id: "junior", 
    label: "Junior", 
    icon: Bot,
    description: "Your AI legal assistant"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Module Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border-b border-border"
      >
        <div className="container mx-auto max-w-7xl py-3">
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-accent hover:shadow-md hover:scale-105 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">{module.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center py-12 md:py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container max-w-6xl"
        >
          {/* Hero Content */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-4"
              variants={itemVariants}
            >
              Junior.AI for Indian Lawyers
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              AI-powered legal assistance for Indian lawyers and legal professionals
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Button asChild size="lg" className="gap-2 group">
                <Link href="/about">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12"
          >
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{module.label}</h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
