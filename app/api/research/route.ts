import { NextRequest } from "next/server";
import { getSetting } from "@/lib/db";
import { createResearchQuery } from "@/lib/database/services";
import { withValidation, createResearchSchema, serverError } from "@/lib/middleware/validation";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware/auth";

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

async function handleResearch(req: AuthenticatedRequest, data: any) {
  try {
    const { query, clientId, save, model } = data;
    const userId = req.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: "User not authenticated" }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
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
    const refined = `${basePrompt}\n\nUser query: ${query}`;

    const primary = await callInLegalBert(refined);
    let finalText = primary.text?.trim() ?? "";
    let confidence = primary.confidence;
    
    if (!finalText || primary.confidence < 0.6) {
      const fallback = await callDeepSeek(refined);
      if (fallback) {
        finalText = fallback.trim();
        confidence = 0.8;
      }
    }
    
    finalText = finalText.replace(/\n{3,}/g, "\n\n").trim();

    // Save research query
    const researchQuery = await createResearchQuery({
      userId,
      clientId,
      queryText: query,
      responseText: finalText,
      status: 'completed',
      model: model || 'deepseek',
      confidence
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: { 
        result: finalText, 
        id: researchQuery.id,
        confidence 
      } 
    }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("/api/research error", error);
    return serverError("Research failed");
  }
}

export const POST = withAuth(
  withValidation(createResearchSchema)(handleResearch)
);


