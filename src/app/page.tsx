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
      <main className="container mx-auto px-4 py-20">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Junior AI for Indian Lawyers
          </h1>
        </div>

        {/* Four Equal Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="shadow-sm border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">{feature.label}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Two Buttons */}
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/about">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}