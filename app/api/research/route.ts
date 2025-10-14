import { NextRequest } from "next/server";
import { getSetting, saveResearchQuery } from "@/lib/db";

async function callInLegalBert(query: string) {
  const url = process.env.INLEGALBERT_API_URL;
  const key = process.env.INLEGALBERT_API_KEY;
  if (!url) return { text: "", confidence: 0 };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify({ text: query }),
    cache: "no-store",
  });
  if (!res.ok) return { text: "", confidence: 0 };
  const data = await res.json().catch(() => ({}));
  const text: string = data.result ?? data.text ?? "";
  const confidence: number = typeof data.confidence === "number" ? data.confidence : (text ? 0.7 : 0);
  return { text, confidence };
}

async function callDeepSeek(query: string) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return "";
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a legal research assistant for Indian law." },
        { role: "user", content: query },
      ],
      temperature: 0.3,
    }),
    cache: "no-store",
  });
  if (!res.ok) return "";
  const data: unknown = await res.json().catch(() => ({}));
  let text = "";
  if (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as { choices?: unknown }).choices)
  ) {
    const choices = (data as { choices: Array<{ message?: { content?: string } }> }).choices;
    const first = choices[0];
    if (first && first.message && typeof first.message.content === "string") {
      text = first.message.content;
    }
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawQuery: string = String(body.query ?? "").trim();
    const userId: string | undefined = body.userId ? String(body.userId) : undefined;
    if (!rawQuery) {
      return new Response(JSON.stringify({ error: "Missing query" }), { status: 400 });
    }

    const envPrompt = process.env.PROMPT_BASE;
    const storedPrompt = await getSetting("PROMPT_BASE").catch(() => undefined);
    const basePrompt = (storedPrompt ?? envPrompt ?? "Refine and clarify the legal research query for Indian law.").trim();
    const refined = `${basePrompt}\n\nUser query: ${rawQuery}`;

    const primary = await callInLegalBert(refined);
    let finalText = primary.text?.trim() ?? "";
    if (!finalText || primary.confidence < 0.6) {
      const fallback = await callDeepSeek(refined);
      if (fallback) finalText = fallback.trim();
    }
    finalText = finalText.replace(/\n{3,}/g, "\n\n").trim();

    const id = `rq_${Math.random().toString(36).slice(2, 10)}`;
    await saveResearchQuery({ id, userId, queryText: rawQuery, responseText: finalText });

    return new Response(JSON.stringify({ result: finalText, id }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("/api/research error", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}


