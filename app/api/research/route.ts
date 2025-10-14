import { NextRequest } from "next/server";
import { getSetting, saveResearchQuery } from "@/lib/db";

async function callInLegalBert(query: string) {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) return { text: "", confidence: 0 };
  
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/law-ai/InLegalBERT", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: query,
        options: { wait_for_model: true }
      }),
      cache: "no-store",
    });
    
    if (!res.ok) return { text: "", confidence: 0 };
    const data = await res.json().catch(() => ({}));
    
    // Handle different response formats from HF API
    let text = "";
    let confidence = 0;
    
    if (Array.isArray(data)) {
      // Standard HF inference response
      const firstResult = data[0];
      if (firstResult && firstResult.label) {
        text = firstResult.label;
        confidence = firstResult.score || 0.7;
      }
    } else if (data.generated_text) {
      // Text generation response
      text = data.generated_text;
      confidence = 0.8;
    } else if (data.result) {
      // Custom response format
      text = data.result;
      confidence = 0.7;
    }
    
    return { text, confidence };
  } catch (error) {
    console.error("InLegalBERT API error:", error);
    return { text: "", confidence: 0 };
  }
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
    const clientName: string | undefined = body.clientName ? String(body.clientName) : undefined;
    const save: boolean = Boolean(body.save);
    const result: string | undefined = body.result ? String(body.result) : undefined;

    // Handle save request
    if (save && result && clientName) {
      const id = `rq_${Math.random().toString(36).slice(2, 10)}`;
      await saveResearchQuery({ 
        id, 
        userId: clientName, // Using clientName as userId for organization
        queryText: rawQuery, 
        responseText: result 
      });
      return new Response(JSON.stringify({ success: true, message: "Research saved successfully" }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    if (!rawQuery) {
      return new Response(JSON.stringify({ error: "Missing query" }), { status: 400 });
    }

    const envPrompt = process.env.PROMPT_BASE;
    const storedPrompt = await getSetting("PROMPT_BASE").catch(() => undefined);
    const basePrompt = (storedPrompt ?? envPrompt ?? `You are an expert Indian legal research assistant. Provide comprehensive, accurate, and practical legal guidance for Indian law. 

For any legal query, include:
1. Relevant Indian laws, acts, and sections
2. Recent case law and precedents
3. Practical steps and procedures
4. Important considerations and warnings
5. References to specific legal provisions

Be specific, cite relevant laws, and provide actionable advice. Focus on Indian legal system, courts, and procedures.`).trim();
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


