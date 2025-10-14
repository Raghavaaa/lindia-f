import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    
    // Test database connection
    const result = await db.get("SELECT 1 as test");
    
    // Check if users table exists and has data
    const userCount = await db.get("SELECT COUNT(*) as count FROM users");
    
    return NextResponse.json({
      success: true,
      database: "connected",
      testQuery: result,
      userCount: userCount?.count || 0,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "set" : "missing",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "set" : "missing",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "missing",
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
