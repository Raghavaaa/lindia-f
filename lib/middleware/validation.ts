import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['user', 'admin', 'lawyer']).optional().default('user')
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  image: z.string().url('Invalid image URL').optional()
});

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().optional(),
  referenceId: z.string().optional()
});

export const updateClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone number is required').optional(),
  address: z.string().optional(),
  referenceId: z.string().optional()
});

export const createResearchSchema = z.object({
  query: z.string().min(1, 'Query is required').max(5000, 'Query too long'),
  clientId: z.string().optional(),
  save: z.boolean().optional().default(false),
  model: z.enum(['deepseek', 'inlegalbert', 'manual']).optional().default('deepseek')
});

export const createCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  clientId: z.string().min(1, 'Client ID is required'),
  startDate: z.string().datetime('Invalid date format'),
  tags: z.array(z.string()).optional()
});

export const updateCaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().optional(),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  status: z.enum(['active', 'closed', 'pending']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  endDate: z.string().datetime('Invalid date format').optional(),
  tags: z.array(z.string()).optional()
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional()
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});

// Validation middleware factory
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return function(
    request: NextRequest,
    handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        let data: any;
        
        if (req.method === 'GET') {
          // Parse query parameters
          const url = new URL(req.url);
          const params = Object.fromEntries(url.searchParams.entries());
          data = schema.parse(params);
        } else {
          // Parse JSON body
          const body = await req.json();
          data = schema.parse(body);
        }
        
        return handler(req, data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              success: false,
              error: 'Validation failed',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            { status: 400 }
          );
        }
        
        console.error('Validation middleware error:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid request format' },
          { status: 400 }
        );
      }
    };
  };
}

// Common validation functions
export function validateId(id: string): boolean {
  return idParamSchema.safeParse({ id }).success;
}

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function validatePhone(phone: string): boolean {
  return z.string().min(10).max(15).safeParse(phone).success;
}

// Error response helpers
export function validationError(errors: z.ZodError['errors']): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    },
    { status: 400 }
  );
}

export function notFoundError(resource: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`
    },
    { status: 404 }
  );
}

export function unauthorizedError(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 401 }
  );
}

export function forbiddenError(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 403 }
  );
}

export function serverError(message: string = 'Internal server error'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message
    },
    { status: 500 }
  );
}

