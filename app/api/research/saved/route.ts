import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const db = await getDb();
    const research = await db.all(
      `SELECT id, query_text, response_text, created_at FROM research_queries 
       WHERE user_id = ? ORDER BY created_at DESC`,
      session.user.id
    );

    return NextResponse.json({ research });
  } catch (error) {
    console.error("Error fetching saved research:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
