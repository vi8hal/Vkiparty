// ============================================================
// src/lib/api.ts
//
// Standardised API response helpers + error classes.
// All route handlers use these to ensure consistent JSON output.
// ============================================================

import { NextResponse } from 'next/server';
import { ZodError }     from 'zod';

// ─── RESPONSE SHAPE ──────────────────────────────────────────

export type ApiResponse<T = unknown> =
  | { success: true;  data: T; message?: string }
  | { success: false; error: { code: string; message: string; details?: unknown } };

// ─── SUCCESS HELPERS ─────────────────────────────────────────

export function ok<T>(data: T, message?: string, status = 200): NextResponse {
  return NextResponse.json({ success: true, data, message } satisfies ApiResponse<T>, { status });
}

export function created<T>(data: T, message?: string): NextResponse {
  return ok(data, message, 201);
}

// ─── ERROR HELPERS ───────────────────────────────────────────

export function apiError(
  code:    string,
  message: string,
  status:  number,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message, details } } satisfies ApiResponse,
    { status }
  );
}

export const errors = {
  badRequest:    (msg = 'Bad request', details?: unknown) =>
    apiError('BAD_REQUEST',    msg, 400, details),
  unauthorized:  (msg = 'Authentication required') =>
    apiError('UNAUTHORIZED',   msg, 401),
  forbidden:     (msg = 'Insufficient permissions') =>
    apiError('FORBIDDEN',      msg, 403),
  notFound:      (resource = 'Resource') =>
    apiError('NOT_FOUND',      `${resource} not found`, 404),
  conflict:      (msg = 'Resource already exists') =>
    apiError('CONFLICT',       msg, 409),
  tooManyReqs:   (msg = 'Too many requests. Please slow down.') =>
    apiError('RATE_LIMIT',     msg, 429),
  internal:      (msg = 'An internal error occurred. Please try again.') =>
    apiError('INTERNAL',       msg, 500),
  validation:    (issues: unknown) =>
    apiError('VALIDATION',     'Validation failed', 400, issues),
};

// ─── ZOD ERROR HANDLER ───────────────────────────────────────

export function handleZodError(err: ZodError): NextResponse {
  return errors.validation(
    err.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
  );
}

// ─── GLOBAL ROUTE WRAPPER ────────────────────────────────────

import { NextRequest } from 'next/server';

type AnyRouteHandler = (req: NextRequest, context: any) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a route handler to catch all unhandled errors.
 * Usage: export const GET = routeHandler(async (req) => { ... });
 */
export function routeHandler(handler: AnyRouteHandler): AnyRouteHandler {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (err: any) {
      if (err instanceof ZodError) return handleZodError(err);
      console.error('[API Error]', err);
      return errors.internal();
    }
  };
}
