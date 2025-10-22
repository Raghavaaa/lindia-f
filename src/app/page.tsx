import Link from "next/link";
import { Building2, Search, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { 
    id: "property", 
    label: "Property Opinion", 
    icon: Building2
  },
  { 
    id: "research", 
    label: "Legal Research", 
    icon: Search
  },
  { 
    id: "case", 
    label: "Case", 
    icon: FileText
  },
  { 
    id: "junior", 
    label: "Junior", 
    icon: Bot
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Multi-layer Picasso-inspired gradient background */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, 
              rgba(255, 220, 192, 0.85) 0%,
              rgba(255, 201, 209, 0.7) 35%,
              rgba(230, 223, 247, 0.5) 70%,
              rgba(251, 250, 252, 1) 100%
            ),
            linear-gradient(180deg, 
              rgba(230, 223, 247, 0.15) 0%, 
              transparent 30%, 
              transparent 70%, 
              rgba(230, 223, 247, 0.2) 100%
            ),
            #FBFAFC
          `,
        }}
      >
        {/* Subtle noise overlay to prevent banding */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative">
        {/* Main Heading */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="relative">
            {/* Subtle scrim behind headline for WCAG compliance */}
            <div className="absolute inset-0 -mx-4 sm:-mx-8 -my-2 bg-white/40 backdrop-blur-[2px] rounded-3xl -z-10" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1820] mb-4 sm:mb-6 md:mb-8 leading-tight">
              Junior AI for Indian Lawyers
            </h1>
          </div>
        </div>

        {/* Two Buttons - Premium Design */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 sm:mb-12 md:mb-16">
          <Button asChild size="lg" className="relative h-14 px-6 w-full sm:w-auto min-w-[200px] rounded-xl bg-gradient-to-b from-black to-gray-900 text-white font-semibold text-lg tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-150 ease-out focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none">
            <Link href="/about">Get Started</Link>
          </Button>
          <Button asChild size="lg" className="relative h-14 px-6 w-full sm:w-auto min-w-[200px] rounded-xl bg-gradient-to-b from-black to-gray-900 text-white font-semibold text-lg tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-150 ease-out focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none">
            <Link href="/login">Go to App</Link>
          </Button>
        </div>

        {/* Four Boxes - Enhanced with backdrop blur */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 bg-white/40 backdrop-blur-sm hover:scale-[1.02]">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-gray-800 rounded-lg shadow-md">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-[#0B1820] text-sm sm:text-base">{feature.label}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}