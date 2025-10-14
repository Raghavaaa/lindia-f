import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Auth test endpoint",
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "set" : "missing",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "set" : "missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "missing",
    },
    expectedCallbackUrl: "https://lindia-production.up.railway.app/api/auth/callback/google",
    timestamp: new Date().toISOString()
  });
}
