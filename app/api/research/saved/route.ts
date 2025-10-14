import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
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

    return new Response(JSON.stringify({ research }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Error fetching saved research:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
