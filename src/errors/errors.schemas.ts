import type { ExceptionStatusCode } from '@/api/http.schemas';

// Unified interface for handler errors to segregate them from application HTTP errors
export type HandlerError = Record<string, { httpCode: ExceptionStatusCode; Exception: abstract new (...args: any[]) => Error }>;
