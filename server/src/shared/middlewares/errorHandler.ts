import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';

const PRISMA_ERRORS: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: 'A record with this value already exists' },
  P2003: { status: 400, message: 'A referenced record does not exist or is still in use' },
  P2025: { status: 404, message: 'Record not found' },
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && PRISMA_ERRORS[err.code]) {
    const { status, message } = PRISMA_ERRORS[err.code]!;
    res.status(status).json({ message });
    return;
  }

  console.error('Unexpected error:', err);
  const isProd = process.env['NODE_ENV'] === 'production';
  const detail = err instanceof Error ? err.message : String(err);
  res.status(500).json({ message: 'Internal server error', ...(isProd ? {} : { detail }) });
}
