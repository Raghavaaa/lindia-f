import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "AI Law Junior API is running",
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "set" : "missing",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "set" : "missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "missing",
    }
  });
}
