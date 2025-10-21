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
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Main Heading */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight">
            Junior AI for Indian Lawyers
          </h1>
        </div>

        {/* Two Buttons - Perfectly centered above boxes */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16">
          <Button asChild size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto w-full sm:w-auto min-w-[140px] sm:min-w-[160px] border-2">
            <Link href="/about">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto border-2 w-full sm:w-auto min-w-[140px] sm:min-w-[160px]">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Four Boxes - Centered with consistent spacing */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{feature.label}</h3>
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