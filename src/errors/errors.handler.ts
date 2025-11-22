import { failure } from '@/api/http.factory';
import type { APIError } from '@/api/http.schemas';

import { DEFAULT_INTERNAL_ERROR } from './errors.constants';
import type { HandlerError } from './errors.schemas';

export function createErrorHandler(registries: HandlerError[]) {
  // Handles typed (HandlerError) errors gracefully,
  // returning appropriate HTTP status codes and error messages

  return {
    error(error: Error): APIError {
      for (const registry of registries) {
        for (const { httpCode, Exception } of Object.values(registry)) {
          if (error instanceof Exception) return failure({ status: httpCode, error: error.message });
        }
      }
      return failure({ status: 500, error: DEFAULT_INTERNAL_ERROR });
    },
  };
}
