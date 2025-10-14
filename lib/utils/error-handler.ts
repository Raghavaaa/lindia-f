import { NextResponse } from 'next/server';
import { logger } from './logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: any[]) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
  }
}

export function handleError(error: Error, userId?: string): NextResponse {
  // Log the error
  logger.error(`Unhandled error: ${error.message}`, error, userId, {
    errorType: error.constructor.name,
    stack: error.stack
  });

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error instanceof ValidationError && error.details && { details: error.details })
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors from external libraries
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.message
      },
      { status: 400 }
    );
  }

  // Handle database errors
  if (error.name === 'SqliteError' || error.message.includes('SQLITE')) {
    return NextResponse.json(
      {
        success: false,
        error: 'Database error occurred'
      },
      { status: 500 }
    );
  }

  // Handle network errors
  if (error.name === 'FetchError' || error.message.includes('fetch')) {
    return NextResponse.json(
      {
        success: false,
        error: 'Network error occurred'
      },
      { status: 503 }
    );
  }

  // Default error response
  return NextResponse.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    },
    { status: 500 }
  );
}

// Async error wrapper
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw error;
    }
  };
}

// Error boundary for API routes
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error as Error);
    }
  };
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const oldestRequest = Math.min(...requests);
    
    return oldestRequest + this.windowMs;
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Rate limiting middleware
export function withRateLimit(identifier: string) {
  return (req: Request): NextResponse | null => {
    if (!rateLimiter.isAllowed(identifier)) {
      const resetTime = rateLimiter.getResetTime(identifier);
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimiter.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(identifier).toString(),
            'X-RateLimit-Reset': resetTime.toString()
          }
        }
      );
    }
    return null;
  };
}

