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
      <main className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        {/* Main Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Junior AI for Indian Lawyers
          </h1>
        </div>

        {/* Four Boxes - Reduced to 50% width */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
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

        {/* Two Buttons - Centered and Responsive */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 h-auto w-full sm:w-auto">
            <Link href="/about">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 h-auto border-2 w-full sm:w-auto">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}