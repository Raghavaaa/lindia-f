import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "OAuth Test Endpoint",
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
    },
    expectedRedirectURI: "https://lindia-production.up.railway.app/api/auth/callback/google",
    timestamp: new Date().toISOString()
  });
}
