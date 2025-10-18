import { Router, Response } from 'express';
import { z } from 'zod';
import { asyncHandler, AppError } from '../middleware/error-handler';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { callAIModel } from '../services/ai-service';

const router = Router();

const caseAnalysisSchema = z.object({
  caseTitle: z.string().min(1, 'Case title is required'),
  caseType: z.string().min(1, 'Case type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  parties: z.object({
    plaintiff: z.string().optional(),
    defendant: z.string().optional(),
  }).optional(),
  facts: z.string().optional(),
  legalIssues: z.array(z.string()).optional(),
});

/**
 * POST /case/analyze
 * Analyze a legal case and provide insights
 */
router.post(
  '/analyze',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = caseAnalysisSchema.parse(req.body);

    const prompt = `You are an expert Indian legal case analyst. Analyze the following case:

Case Title: ${data.caseTitle}
Case Type: ${data.caseType}
Description: ${data.description}
${data.facts ? `Facts: ${data.facts}` : ''}
${data.parties?.plaintiff ? `Plaintiff: ${data.parties.plaintiff}` : ''}
${data.parties?.defendant ? `Defendant: ${data.parties.defendant}` : ''}
${data.legalIssues?.length ? `Legal Issues: ${data.legalIssues.join(', ')}` : ''}

Provide a comprehensive case analysis including:
1. **Legal Framework**: Applicable Indian laws, acts, and sections
2. **Case Precedents**: Relevant Supreme Court and High Court judgments
3. **Strengths & Weaknesses**: Analysis of legal position
4. **Strategy**: Recommended legal strategy and arguments
5. **Evidence**: Required evidence and documentation
6. **Procedure**: Court procedures and timelines
7. **Potential Outcomes**: Likely outcomes and remedies
8. **Risk Mitigation**: How to strengthen the case

Be thorough, cite specific case law, and provide practical guidance.`;

    const result = await callAIModel(prompt, 'deepseek');

    res.json({
      success: true,
      data: {
        analysis: result.text,
        confidence: result.confidence,
        caseTitle: data.caseTitle,
        caseType: data.caseType,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * POST /case/draft
 * Generate case-related legal documents
 */
router.post(
  '/draft',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const draftSchema = z.object({
      documentType: z.string().min(1, 'Document type is required'),
      caseTitle: z.string().min(1, 'Case title is required'),
      parties: z.object({
        plaintiff: z.string(),
        defendant: z.string(),
      }),
      facts: z.string().min(10, 'Facts are required'),
      relief: z.string().optional(),
    });

    const data = draftSchema.parse(req.body);

    const prompt = `You are an expert Indian legal document drafter. Draft a ${data.documentType} for:

Case: ${data.caseTitle}
Plaintiff: ${data.parties.plaintiff}
Defendant: ${data.parties.defendant}
Facts: ${data.facts}
${data.relief ? `Relief Sought: ${data.relief}` : ''}

Create a professional, court-ready document following Indian legal format and standards. Include all necessary sections, legal citations, and proper formatting.`;

    const result = await callAIModel(prompt, 'deepseek');

    res.json({
      success: true,
      data: {
        document: result.text,
        documentType: data.documentType,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /case/templates
 * Get case document templates
 */
router.get('/templates', (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'plaint',
        name: 'Plaint (Civil)',
        description: 'Draft a plaint for civil cases',
      },
      {
        id: 'written-statement',
        name: 'Written Statement',
        description: 'Draft a written statement (defense)',
      },
      {
        id: 'petition',
        name: 'Writ Petition',
        description: 'Draft a writ petition',
      },
      {
        id: 'bail-application',
        name: 'Bail Application',
        description: 'Draft a bail application',
      },
      {
        id: 'affidavit',
        name: 'Affidavit',
        description: 'Draft an affidavit',
      },
    ],
  });
});

export { router as caseRouter };

