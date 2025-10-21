import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Search, FileText, Bot, ArrowLeft, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const features = [
    { 
      icon: Building2,
      title: "Property Opinion",
      description: "AI-powered property title analysis with comprehensive legal insights"
    },
    { 
      icon: Search,
      title: "Legal Research", 
      description: "Advanced research capabilities powered by machine learning algorithms"
    },
    { 
      icon: FileText,
      title: "Case Analysis",
      description: "Intelligent case law analysis and precedent identification"
    },
    { 
      icon: Bot,
      title: "AI Assistant",
      description: "Your intelligent legal research companion for complex queries"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            About Legal India
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 sm:mb-12">
            Empowering Indian lawyers with cutting-edge AI technology
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Left Column - Mission */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Our Mission
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Legal India is an AI-powered platform designed specifically for Indian lawyers and legal professionals. 
                  Our mission is to streamline legal research and provide intelligent insights to enhance your practice.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  We believe that technology should augment human expertise, not replace it. Our platform empowers 
                  legal professionals to work more efficiently while maintaining the highest standards of accuracy and reliability.
                </p>
              </CardContent>
            </Card>

            {/* Right Column - Technology */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Advanced Technology
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  With our advanced AI technology, you can access comprehensive legal research, property opinions, 
                  case analysis, and junior AI assistance - all in one integrated platform.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Our machine learning algorithms are trained on vast legal databases, ensuring accurate and 
                  up-to-date information for your legal practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Our Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-blue-50 rounded-xl">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Button asChild size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto w-full sm:w-auto min-w-[140px] sm:min-w-[160px] border-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto border-2 w-full sm:w-auto min-w-[140px] sm:min-w-[160px]">
            <Link href="/login" className="flex items-center gap-2">
              Go to App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}