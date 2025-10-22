import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
        {/* Hero Section with text scrim for contrast */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="relative">
            {/* Subtle scrim behind headline for WCAG compliance */}
            <div className="absolute inset-0 -mx-4 sm:-mx-8 -my-2 bg-white/40 backdrop-blur-[2px] rounded-3xl -z-10" />
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1820] mb-6 sm:mb-8 leading-tight tracking-tight">
              Redefining Indian Lawyers Work.
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-[#111827] font-medium leading-relaxed mb-4 sm:mb-6">
            Fast. Sharp. Reliable, secure
          </p>
          <p className="text-base sm:text-lg md:text-xl text-[#1F2937] leading-relaxed max-w-3xl mx-auto">
            A single platform that handles property opinions, legal research, case tracking, and your own AI junior — all in one clean, intelligent workspace.
          </p>
        </div>

        {/* Features List */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-left p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0B1820] mb-2 sm:mb-3">
                1. Property Opinion
              </h3>
              <p className="text-base sm:text-lg text-[#374151] leading-relaxed">
                Upload, review, and get ready-to-use property opinions without delay.
              </p>
            </div>
            
            <div className="text-left p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0B1820] mb-2 sm:mb-3">
                2. Legal Research
              </h3>
              <p className="text-base sm:text-lg text-[#374151] leading-relaxed">
                Type your query and get direct, case-backed answers — no clutter, no confusion.
              </p>
            </div>
            
            <div className="text-left p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0B1820] mb-2 sm:mb-3">
                3. Case Management
              </h3>
              <p className="text-base sm:text-lg text-[#374151] leading-relaxed">
                Control every case, document, and client from one secure dashboard.
              </p>
            </div>
            
            <div className="text-left p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0B1820] mb-2 sm:mb-3">
                4. Junior AI
              </h3>
              <p className="text-base sm:text-lg text-[#374151] leading-relaxed">
                A silent assistant
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#111827] leading-relaxed mb-6 sm:mb-8">
            Step into the next era of Indian law.
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B1820] mb-6 sm:mb-8">
            Built for Lawyers Who Want to Move Fast.
          </h2>
        </div>

        {/* Value Propositions */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="space-y-6 sm:space-y-8 text-center">
            <p className="text-base sm:text-lg md:text-xl text-[#1F2937] leading-relaxed">
              It reads, thinks, and responds in the language of Indian law.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[#1F2937] leading-relaxed">
              Gives lawyer an intelligent system that saves time, removes clutter, and sharpens decision-making.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[#1F2937] leading-relaxed">
              Every feature exists to make lawyer&apos;s work smoother, sharper, and smarter.
            </p>
          </div>
        </div>

        {/* Brand */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B1820]">
            Legalindia.ai
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto w-full sm:w-auto min-w-[140px] sm:min-w-[160px] bg-black hover:bg-gray-800 text-white transition-all duration-300">
            <Link href="/">Home</Link>
              </Button>
          <Button asChild size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 h-auto w-full sm:w-auto min-w-[140px] sm:min-w-[160px] bg-black hover:bg-gray-800 text-white transition-all duration-300">
            <Link href="/login">Go to App</Link>
              </Button>
        </div>
      </main>
    </div>
  );
}