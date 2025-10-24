import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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

      <div className="min-h-screen flex items-center justify-center px-4 py-6 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative">
              {/* Subtle scrim behind headline */}
              <div className="absolute inset-0 -mx-4 sm:-mx-6 -my-2 bg-white/40 backdrop-blur-[2px] rounded-2xl -z-10 shadow-md" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B1820] mb-4 sm:mb-6 leading-tight">
                Legal India
              </h1>
            </div>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}