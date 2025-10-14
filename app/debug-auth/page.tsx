"use client";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();

  const handleGoogleLogin = () => {
    console.log("Starting Google login...");
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Session Status:</h2>
          <p>Status: {status}</p>
          <p>User: {session?.user?.name || "Not logged in"}</p>
          <p>Email: {session?.user?.email || "Not logged in"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Environment Check:</h2>
          <p>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set"}</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Google Login
        </button>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Expected URLs:</h2>
          <p>Callback URL: https://lindia-production.up.railway.app/api/auth/callback/google</p>
          <p>Sign-in URL: https://lindia-production.up.railway.app/api/auth/signin/google</p>
        </div>
      </div>
    </div>
  );
}
