"use client";

import { motion } from "framer-motion";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  FileText, 
  Building2, 
  Bot,
  ArrowRight,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "Start Research",
    description: "Begin a new legal research query",
    icon: Search,
    href: "/app?module=research",
    color: "bg-blue-500"
  },
  {
    title: "Property Opinion",
    description: "Generate property title analysis",
    icon: Building2,
    href: "/app?module=property",
    color: "bg-green-500"
  },
  {
    title: "Case Analysis",
    description: "Analyze case law and precedents",
    icon: FileText,
    href: "/app?module=case",
    color: "bg-purple-500"
  },
  {
    title: "AI Assistant",
    description: "Chat with your AI legal assistant",
    icon: Bot,
    href: "/app?module=junior",
    color: "bg-orange-500"
  }
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back to LegalIndia.AI
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your legal practice today
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <DashboardStats />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div key={action.title} variants={itemVariants}>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-3 h-auto p-4 hover:bg-muted/50"
                      >
                        <Link href={action.href}>
                          <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-foreground">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                        </Link>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <RecentActivity />
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold text-primary mb-2">94.2%</div>
                  <div className="text-sm text-muted-foreground">Research Success Rate</div>
                  <div className="text-xs text-green-600 mt-1">+2.1% from last month</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold text-primary mb-2">342h</div>
                  <div className="text-sm text-muted-foreground">Time Saved This Month</div>
                  <div className="text-xs text-green-600 mt-1">+23% from last month</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold text-primary mb-2">89</div>
                  <div className="text-sm text-muted-foreground">Active Clients</div>
                  <div className="text-xs text-green-600 mt-1">+5 new this month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
