import { Router, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/error-handler';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { callAIModel } from '../services/ai-service';

const router = Router();

const researchSchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  model: z.enum(['deepseek', 'inlegalbert']).optional().default('deepseek'),
  clientId: z.string().optional(),
  caseId: z.string().optional(),
  save: z.boolean().optional().default(false),
});

/**
 * POST /research
 * Perform legal research using AI models
 */
router.post(
  '/',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = researchSchema.parse(req.body);

    const basePrompt = process.env.PROMPT_BASE || `You are an expert Indian legal research assistant. Provide comprehensive, accurate, and practical legal guidance for Indian law. 

For any legal query, include:
1. Relevant Indian laws, acts, and sections
2. Recent case law and precedents
3. Practical steps and procedures
4. Important considerations and warnings
5. References to specific legal provisions

Be specific, cite relevant laws, and provide actionable advice. Focus on Indian legal system, courts, and procedures.`;

    const refinedQuery = `${basePrompt}\n\nUser query: ${data.query}`;

    const result = await callAIModel(refinedQuery, data.model);

    res.json({
      success: true,
      data: {
        result: result.text,
        confidence: result.confidence,
        model: data.model,
        query: data.query,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /research/history
 * Get research history (mock endpoint)
 */
router.get('/history', optionalAuth, (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Research history feature coming soon',
  });
});

export { router as researchRouter };

