// /login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [stage, setStage] = useState<"start" | "form">("start");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  function simulateGoogleSignIn() {
    // simple UI flow: switch to form stage
    setStage("form");
    // optionally pre-fill name from Google simulation
    setName("");
  }

  function handleContinue() {
    // Basic front-end validation
    if (!name.trim()) return alert("Enter name");
    if (!phone.trim()) return alert("Enter phone");
    // Save to localStorage (frontend-only)
    const profile = { name, address, phone };
    try {
      localStorage.setItem("legalindia_profile", JSON.stringify(profile));
    } catch {}
    router.push("/app");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md px-6 py-10">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

          {stage === "start" && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600 text-center">Sign in with Google to continue (UI-only).</p>

              <button
                onClick={simulateGoogleSignIn}
                className="w-full inline-flex items-center justify-center gap-3 btn btn-secondary"
                aria-label="Sign in with Google (simulated)"
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
                <span className="text-sm">Sign in with Google (simulate)</span>
              </button>

              <div className="text-center text-sm text-gray-500">
                Or continue without Google — details will be asked next.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStage("form")}
                  className="flex-1 btn btn-secondary"
                >
                  Continue
                </button>
                <a href="/" className="flex-1 btn btn-secondary text-center">
                  Back
                </a>
              </div>
            </div>
          )}

          {stage === "form" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">For Lawyers — Please complete your details.</p>

              <label className="block">
                <div className="text-sm text-gray-700 mb-1">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Your full name"
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-700 mb-1">Address</div>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input"
                  placeholder="Office / City"
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-700 mb-1">Phone</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  placeholder="+91 99999 99999"
                />
              </label>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleContinue}
                  className="flex-1 btn btn-primary"
                >
                  Continue to App
                </button>
                <button
                  onClick={() => setStage("start")}
                  className="btn btn-secondary"
                >
                  Back
                </button>
              </div>

              <div className="text-xs text-gray-400 mt-2">All data is stored locally (front-end only).</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}