import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const research = await db.all("SELECT * FROM research_queries ORDER BY created_at DESC");
    return NextResponse.json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json({ error: "Failed to fetch research" }, { status: 500 });
  }
}
