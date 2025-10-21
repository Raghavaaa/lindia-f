import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Redefining Indian Lawyers Work.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-4 sm:mb-6">
            Fast. Sharp. Reliable, secure
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            A single platform that handles property opinions, legal research, case tracking, and your own AI junior — all in one clean, intelligent workspace.
          </p>
        </div>

        {/* Features List */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                1. Property Opinion
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Upload, review, and get ready-to-use property opinions without delay.
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                2. Legal Research
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Type your query and get direct, case-backed answers — no clutter, no confusion.
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                3. Case Management
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Control every case, document, and client from one secure dashboard.
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                4. Junior AI
              </h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                A silent assistant
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 leading-relaxed mb-6 sm:mb-8">
            Step into the next era of Indian law.
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Built for Lawyers Who Want to Move Fast.
          </h2>
        </div>

        {/* Value Propositions */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="space-y-6 sm:space-y-8 text-center">
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              It reads, thinks, and responds in the language of Indian law.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              Gives lawyer an intelligent system that saves time, removes clutter, and sharpens decision-making.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              Every feature exists to make lawyer&apos;s work smoother, sharper, and smarter.
            </p>
          </div>
        </div>

        {/* Brand */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Legalindia.ai
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Button asChild size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto w-full sm:w-auto min-w-[140px] sm:min-w-[160px] border-2">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto border-2 w-full sm:w-auto min-w-[140px] sm:min-w-[160px]">
            <Link href="/login">Go to App</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}