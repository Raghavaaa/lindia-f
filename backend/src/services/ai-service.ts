import { AppError } from '../middleware/error-handler';

interface AIResponse {
  text: string;
  confidence: number;
}

/**
 * Call InLegalBERT model from Hugging Face
 */
async function callInLegalBert(query: string): Promise<AIResponse> {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return { text: '', confidence: 0 };
  }

  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/models/law-ai/InLegalBERT',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: query,
          options: { wait_for_model: true },
        }),
      }
    );

    if (!res.ok) {
      return { text: '', confidence: 0 };
    }

    const data = await res.json().catch(() => ({}));

    let text = '';
    let confidence = 0;

    if (Array.isArray(data)) {
      const firstResult = data[0];
      if (firstResult && firstResult.label) {
        text = firstResult.label;
        confidence = firstResult.score || 0.7;
      }
    } else if (data.generated_text) {
      text = data.generated_text;
      confidence = 0.8;
    } else if (data.result) {
      text = data.result;
      confidence = 0.7;
    }

    return { text, confidence };
  } catch (error) {
    console.error('InLegalBERT API error:', error);
    return { text: '', confidence: 0 };
  }
}

/**
 * Call DeepSeek AI model
 */
async function callDeepSeek(query: string): Promise<AIResponse> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new AppError('DeepSeek API key not configured', 500);
  }

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a legal research assistant for Indian law.',
          },
          { role: 'user', content: query },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('DeepSeek API error:', errorText);
      throw new AppError('Failed to call DeepSeek API', 500);
    }

    const data: unknown = await res.json();
    let text = '';

    if (
      typeof data === 'object' &&
      data !== null &&
      Array.isArray((data as { choices?: unknown }).choices)
    ) {
      const choices = (data as { choices: Array<{ message?: { content?: string } }> })
        .choices;
      const first = choices[0];
      if (first && first.message && typeof first.message.content === 'string') {
        text = first.message.content;
      }
    }

    if (!text) {
      throw new AppError('No response from DeepSeek API', 500);
    }

    return { text: text.trim(), confidence: 0.85 };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('DeepSeek API error:', error);
    throw new AppError('AI service error', 500);
  }
}

/**
 * Main AI model caller - tries InLegalBERT first, falls back to DeepSeek
 */
export async function callAIModel(
  query: string,
  model: 'deepseek' | 'inlegalbert' = 'deepseek'
): Promise<AIResponse> {
  try {
    // If DeepSeek is explicitly requested or preferred
    if (model === 'deepseek') {
      const result = await callDeepSeek(query);
      return result;
    }

    // Try InLegalBERT first
    const primary = await callInLegalBert(query);

    // If InLegalBERT gives good results, use it
    if (primary.text && primary.confidence >= 0.6) {
      return {
        text: primary.text.replace(/\n{3,}/g, '\n\n').trim(),
        confidence: primary.confidence,
      };
    }

    // Fall back to DeepSeek
    const fallback = await callDeepSeek(query);
    return fallback;
  } catch (error) {
    console.error('AI service error:', error);
    throw new AppError('Failed to process AI request', 500);
  }
}

