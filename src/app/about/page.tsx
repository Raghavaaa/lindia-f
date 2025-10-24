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
              rgba(248, 250, 252, 0.85) 0%,
              rgba(241, 245, 249, 0.7) 35%,
              rgba(226, 232, 240, 0.5) 70%,
              rgba(251, 250, 252, 1) 100%
            ),
            linear-gradient(180deg, 
              rgba(226, 232, 240, 0.15) 0%, 
              transparent 30%, 
              transparent 70%, 
              rgba(226, 232, 240, 0.2) 100%
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
        {/* Hero Section with enhanced centering and aesthetics */}
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20 md:mb-24">
          <div className="relative">
            {/* Enhanced scrim with better aesthetics */}
            <div className="absolute inset-0 -mx-6 sm:-mx-12 -my-4 bg-white/50 backdrop-blur-[4px] rounded-3xl -z-10 shadow-lg" />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#0B1820] mb-8 sm:mb-10 leading-tight tracking-tight">
              Redefining Indian Lawyers Work.
            </h1>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl text-[#6B7280] font-medium leading-relaxed mb-6 sm:mb-8">
            Fast. Sharp. Reliable. Secure.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-[#374151] leading-relaxed max-w-4xl mx-auto">
            A single platform that handles property opinions, legal research, case tracking, and your own AI junior — all in one clean, intelligent workspace.
          </p>
        </div>

        {/* Features List - Enhanced 2-column layout */}
        <div className="max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto mb-16 sm:mb-20 md:mb-24">
          {/* Subtle divider line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8 sm:mb-12 md:mb-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0B1820] mb-3 sm:mb-4 md:mb-6">
                Property Opinion
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#374151] leading-relaxed">
                Upload, review, and get ready-to-use property opinions without delay.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0B1820] mb-3 sm:mb-4 md:mb-6">
                Legal Research
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#374151] leading-relaxed">
                Type your query and get direct, case-backed answers — no clutter, no confusion.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0B1820] mb-3 sm:mb-4 md:mb-6">
                Case Management
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#374151] leading-relaxed">
                Control every case, document, and client from one secure dashboard.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#0B1820] mb-3 sm:mb-4 md:mb-6">
                Junior AI
              </h3>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#374151] leading-relaxed">
                Your intelligent assistant for legal research, drafting, and analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement - Enhanced */}
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20 md:mb-24">
          <div className="relative">
            <div className="absolute inset-0 -mx-6 sm:-mx-12 -my-4 bg-white/30 backdrop-blur-[2px] rounded-3xl -z-10"></div>
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#6B7280] leading-relaxed mb-8 sm:mb-10">
              Step into the next era of Indian law.
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1820] mb-8 sm:mb-10 leading-tight">
              Built for Lawyers Who Want to Move Fast.
            </h2>
          </div>
        </div>

        {/* Value Propositions - Enhanced with better spacing */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20 md:mb-24">
          <div className="space-y-8 sm:space-y-10 md:space-y-12 text-center">
            <div className="relative">
              <div className="absolute inset-0 -mx-4 sm:-mx-8 -my-2 bg-white/20 backdrop-blur-[1px] rounded-2xl -z-10"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-[#374151] leading-relaxed font-medium">
                It reads, thinks, and responds in the language of Indian law.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -mx-4 sm:-mx-8 -my-2 bg-white/20 backdrop-blur-[1px] rounded-2xl -z-10"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-[#374151] leading-relaxed font-medium">
                Gives lawyers an intelligent system that saves time, removes clutter, and sharpens decision-making.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -mx-4 sm:-mx-8 -my-2 bg-white/20 backdrop-blur-[1px] rounded-2xl -z-10"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-[#374151] leading-relaxed font-medium">
                Every feature exists to make lawyers&apos; work smoother, sharper, and smarter.
              </p>
            </div>
          </div>
        </div>

        {/* Brand - Enhanced */}
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-20 md:mb-24">
          <div className="relative">
            <div className="absolute inset-0 -mx-6 sm:-mx-12 -my-4 bg-white/40 backdrop-blur-[3px] rounded-3xl -z-10 shadow-lg"></div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1820] tracking-tight">
              Legalindia.ai
            </h3>
          </div>
        </div>

        {/* Action Buttons - Premium Design */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <Button asChild size="lg" className="relative h-10 sm:h-12 md:h-14 px-4 sm:px-6 w-full sm:w-auto min-w-[140px] sm:min-w-[180px] md:min-w-[200px] rounded-lg sm:rounded-xl bg-gradient-to-b from-gray-900 to-black text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-150 ease-out focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none border border-gray-700 hover:border-gray-600 before:absolute before:inset-0 before:rounded-lg sm:before:rounded-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild size="lg" className="relative h-10 sm:h-12 md:h-14 px-4 sm:px-6 w-full sm:w-auto min-w-[140px] sm:min-w-[180px] md:min-w-[200px] rounded-lg sm:rounded-xl bg-gradient-to-b from-gray-900 to-black text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-150 ease-out focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none border border-gray-700 hover:border-gray-600 before:absolute before:inset-0 before:rounded-lg sm:before:rounded-xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150">
            <Link href="/login">Go to App</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}