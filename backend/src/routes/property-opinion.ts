import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler, AppError } from '../middleware/error-handler';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { callAIModel } from '../services/ai-service';

const router = Router();

const propertyOpinionSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  location: z.string().min(1, 'Location is required'),
  issue: z.string().min(1, 'Issue description is required'),
  details: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

/**
 * POST /property-opinion
 * Generate legal opinion for property matters
 */
router.post(
  '/',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = propertyOpinionSchema.parse(req.body);

    const prompt = `You are an expert Indian property law consultant. Provide a comprehensive legal opinion for the following property matter:

Property Type: ${data.propertyType}
Location: ${data.location}
Issue: ${data.issue}
${data.details ? `Additional Details: ${data.details}` : ''}

Please provide:
1. **Legal Analysis**: Applicable property laws, acts, and sections in India
2. **Precedents**: Relevant case law and judicial precedents
3. **Risk Assessment**: Potential legal risks and liabilities
4. **Recommendations**: Step-by-step actionable advice
5. **Documentation**: Required documents and procedures
6. **Timeline**: Expected timeline for resolution

Focus on Indian property laws including Transfer of Property Act 1882, Indian Registration Act 1908, and relevant state-specific laws.`;

    const result = await callAIModel(prompt, 'deepseek');

    res.json({
      success: true,
      data: {
        opinion: result.text,
        confidence: result.confidence,
        propertyType: data.propertyType,
        location: data.location,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

/**
 * GET /property-opinion/templates
 * Get property opinion templates
 */
router.get('/templates', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'sale-deed',
        name: 'Sale Deed Review',
        description: 'Legal review of property sale deed',
        propertyType: 'Residential',
      },
      {
        id: 'title-verification',
        name: 'Title Verification',
        description: 'Verify property title and ownership',
        propertyType: 'Any',
      },
      {
        id: 'boundary-dispute',
        name: 'Boundary Dispute',
        description: 'Legal opinion on property boundary disputes',
        propertyType: 'Land',
      },
      {
        id: 'lease-agreement',
        name: 'Lease Agreement',
        description: 'Review and draft lease agreements',
        propertyType: 'Commercial/Residential',
      },
    ],
  });
});

export { router as propertyOpinionRouter };

