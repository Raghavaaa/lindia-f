"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Store user profile immediately
    const userProfile = {
      name: email.split('@')[0] || "User",
      email: email
    };
    localStorage.setItem("legalindia_profile", JSON.stringify(userProfile));
    
    // Redirect immediately
    window.location.href = "/dashboard";
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      // Use NextAuth signIn for real Google OAuth
      await signIn('google', { 
        callbackUrl: '/dashboard'
      });
    } catch (error) {
      // Handle error silently
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="border border-white/60 shadow-xl bg-white/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
      <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-7">
        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-300 hover:border-gray-400 bg-white/80 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl sm:rounded-2xl font-medium"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-3" />
          ) : null}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-gray-600 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6 sm:space-y-7">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-base sm:text-lg font-semibold text-gray-800">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-base sm:text-lg font-semibold text-gray-800">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="relative w-full h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-b from-gray-900 to-black text-white font-semibold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-150 ease-out focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none border border-gray-700 hover:border-gray-600 before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-150" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}