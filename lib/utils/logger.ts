import { createActivity } from '../database/services';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  async log(entry: LogEntry): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
    
    // Console logging
    if (this.isDevelopment || entry.level === LogLevel.ERROR) {
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(logMessage, entry.error || entry.metadata);
          break;
        case LogLevel.WARN:
          console.warn(logMessage, entry.metadata);
          break;
        case LogLevel.INFO:
          console.info(logMessage, entry.metadata);
          break;
        case LogLevel.DEBUG:
          console.debug(logMessage, entry.metadata);
          break;
      }
    }

    // Database logging for important events
    if (entry.userId && ['error', 'warn', 'info'].includes(entry.level)) {
      try {
        await createActivity({
          type: 'system',
          action: entry.level,
          description: entry.message,
          userId: entry.userId,
          metadata: {
            ...entry.metadata,
            error: entry.error ? {
              name: entry.error.name,
              message: entry.error.message,
              stack: entry.error.stack
            } : undefined
          }
        });
      } catch (dbError) {
        // Fallback to console if database logging fails
        console.error('Failed to log to database:', dbError);
      }
    }
  }

  async error(message: string, error?: Error, userId?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      message,
      error,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  async warn(message: string, userId?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.WARN,
      message,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  async info(message: string, userId?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      message,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  async debug(message: string, userId?: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.DEBUG,
      message,
      userId,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
}

export const logger = new Logger();

// Request logging middleware
export function logRequest(req: NextRequest, userId?: string): void {
  const { method, url } = req;
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
  
  logger.info(`${method} ${url}`, userId, {
    userAgent,
    ip,
    timestamp: new Date().toISOString()
  });
}

// Error logging helper
export function logError(error: Error, context: string, userId?: string, metadata?: Record<string, any>): void {
  logger.error(`Error in ${context}: ${error.message}`, error, userId, {
    ...metadata,
    context,
    stack: error.stack
  });
}

