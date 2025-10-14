import { NextRequest } from "next/server";
import { setSetting } from "@/lib/db";

export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const header = req.headers.get("x-admin-secret");
  if (!secret || header !== secret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const prompt: string = String(body.prompt ?? "").trim();
    if (!prompt) return new Response(JSON.stringify({ error: "Prompt required" }), { status: 400 });
    await setSetting("PROMPT_BASE", prompt);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}


