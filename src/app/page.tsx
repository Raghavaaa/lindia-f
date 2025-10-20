"use client";

import Link from "next/link";
import { Building2, Search, FileText, Bot, ArrowRight, Shield, Zap, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { 
    id: "property", 
    label: "Property Opinion", 
    icon: Building2,
    description: "Instant property title analysis with AI-powered insights"
  },
  { 
    id: "research", 
    label: "Legal Research", 
    icon: Search,
    description: "Comprehensive legal research powered by advanced AI"
  },
  { 
    id: "case", 
    label: "Case Analysis", 
    icon: FileText,
    description: "Case law analysis and precedent identification"
  },
  { 
    id: "junior", 
    label: "AI Assistant", 
    icon: Bot,
    description: "Your intelligent legal research assistant"
  },
];

const benefits = [
  {
    icon: Zap,
    title: "10x Faster Research",
    description: "Reduce research time from hours to minutes with AI-powered analysis"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and compliance"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share insights and collaborate with your legal team seamlessly"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track performance and gain insights into your legal practice"
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

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <main className="flex-1">
        {/* Hero Content */}
        <section className="py-20 md:py-32 px-4 bg-gradient-to-br from-background via-background to-primary/5">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-foreground mb-6"
                variants={itemVariants}
              >
                LegalIndia.AI
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
              >
                The most advanced AI-powered legal research platform for Indian lawyers and law firms
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
              >
                Transform your legal practice with intelligent research, case analysis, and AI-powered insights. 
                Trusted by 500+ law firms across India.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-4 flex-wrap mb-8"
              >
                {isAuthenticated ? (
                  <Button asChild size="lg" className="gap-2 group">
                    <Link href="/app">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-2 group">
                      <Link href="/login">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/demo">Watch Demo</Link>
                    </Button>
                  </>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="text-sm text-muted-foreground">
                <p>✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="container max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
                Everything you need for modern legal practice
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful AI tools designed specifically for Indian legal professionals
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-foreground">{feature.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-muted/30">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="container max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
                Why leading law firms choose LegalIndia.AI
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of legal professionals who have transformed their practice
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex gap-4 p-6 rounded-lg bg-background border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="container max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
                Ready to transform your legal practice?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of legal professionals who trust LegalIndia.AI for their research needs
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="gap-2 group">
                    <Link href="/app">
                      Access Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="gap-2 group">
                      <Link href="/login">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}