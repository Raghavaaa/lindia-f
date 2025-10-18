import { Router, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/error-handler';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { callAIModel } from '../services/ai-service';

const router = Router();

const juniorAssistantSchema = z.object({
  task: z.string().min(3, 'Task description is required'),
  context: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
});

/**
 * POST /junior
 * AI Junior Assistant - General legal assistance
 */
router.post(
  '/',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = juniorAssistantSchema.parse(req.body);

    const prompt = `You are an AI Junior Legal Assistant for Indian law. Help with the following task:

Task: ${data.task}
${data.context ? `Context: ${data.context}` : ''}
Priority: ${data.priority}

As a junior assistant, provide:
1. **Quick Analysis**: Brief understanding of the task
2. **Relevant Laws**: Applicable Indian laws and regulations
3. **Action Items**: Step-by-step tasks to complete
4. **Resources**: Helpful legal resources and references
5. **Timeline**: Suggested timeline for completion
6. **Notes**: Important points to remember

Be concise, practical, and helpful. Focus on Indian legal context.`;

    const result = await callAIModel(prompt, 'deepseek');

    res.json({
      success: true,
      data: {
        assistance: result.text,
        confidence: result.confidence,
        task: data.task,
        priority: data.priority,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /junior/review
 * Review legal documents
 */
router.post(
  '/review',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviewSchema = z.object({
      documentType: z.string().min(1, 'Document type is required'),
      content: z.string().min(10, 'Document content is required'),
      focusAreas: z.array(z.string()).optional(),
    });

    const data = reviewSchema.parse(req.body);

    const prompt = `You are an AI Junior Legal Assistant reviewing a legal document. Review the following ${data.documentType}:

Document Content:
${data.content}

${data.focusAreas?.length ? `Focus Areas: ${data.focusAreas.join(', ')}` : ''}

Provide a comprehensive review including:
1. **Completeness**: Is the document complete?
2. **Legal Accuracy**: Are legal provisions correctly cited?
3. **Formatting**: Does it follow proper legal formatting?
4. **Language**: Is the legal language appropriate?
5. **Risks**: Potential legal risks or issues
6. **Suggestions**: Specific improvements needed
7. **Compliance**: Compliance with Indian legal standards

Be thorough and provide specific, actionable feedback.`;

    const result = await callAIModel(prompt, 'deepseek');

    res.json({
      success: true,
      data: {
        review: result.text,
        documentType: data.documentType,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /junior/explain
 * Explain legal concepts in simple terms
 */
router.post(
  '/explain',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const explainSchema = z.object({
      concept: z.string().min(1, 'Legal concept is required'),
      detail: z.enum(['simple', 'detailed']).optional().default('simple'),
    });

    const data = explainSchema.parse(req.body);

    const detailLevel =
      data.detail === 'simple'
        ? 'Explain in simple, easy-to-understand language suitable for non-lawyers.'
        : 'Provide a detailed explanation with legal nuances, case law, and examples.';

    const prompt = `You are an AI Junior Legal Assistant explaining Indian law concepts. Explain the following:

Concept: ${data.concept}

${detailLevel}

Include:
1. **Definition**: What is it?
2. **Legal Basis**: Relevant laws and sections
3. **Practical Example**: Real-world example
4. **Common Misconceptions**: What people often get wrong
5. **Related Concepts**: Related legal terms
6. **Key Takeaways**: Important points to remember

Make it clear, accurate, and helpful.`;

    const result = await callAIModel(prompt, 'deepseek');

    res.json({
      success: true,
      data: {
        explanation: result.text,
        concept: data.concept,
        detailLevel: data.detail,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /junior/tasks
 * Get common legal tasks
 */
router.get('/tasks', (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'legal-research',
        name: 'Legal Research',
        description: 'Research case law and legal provisions',
        category: 'Research',
      },
      {
        id: 'document-review',
        name: 'Document Review',
        description: 'Review legal documents for accuracy',
        category: 'Documentation',
      },
      {
        id: 'case-summary',
        name: 'Case Summary',
        description: 'Summarize case facts and judgments',
        category: 'Analysis',
      },
      {
        id: 'legal-drafting',
        name: 'Legal Drafting',
        description: 'Draft legal notices and documents',
        category: 'Drafting',
      },
      {
        id: 'compliance-check',
        name: 'Compliance Check',
        description: 'Check compliance with legal requirements',
        category: 'Compliance',
      },
    ],
  });
});

export { router as juniorRouter };

