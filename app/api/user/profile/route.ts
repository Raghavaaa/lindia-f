import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { updateUserProfile } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { phone, address } = body;

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number is required" }), { status: 400 });
    }

    await updateUserProfile(session.user.id, { phone, address });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
