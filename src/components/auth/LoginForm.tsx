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
    <Card className="border border-gray-200 shadow-lg bg-white">
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 sm:h-11 text-sm sm:text-base border-2"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 sm:h-11 text-sm sm:text-base"
              required
            />
          </div>

          <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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