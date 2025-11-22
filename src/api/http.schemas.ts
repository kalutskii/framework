import type { EXCEPTION_STATUS_CODES, SUCCESS_STATUS_CODES } from './http.constants';

export type SuccessStatusCode = (typeof SUCCESS_STATUS_CODES)[number];
export type ExceptionStatusCode = (typeof EXCEPTION_STATUS_CODES)[number];

// Unified interface for API responses between different services in same space
// (one project with different API applications, example: service-one & service-two)
export type APISuccess<T = void> = { ok: true; status: SuccessStatusCode; data: T };
export type APIError = { ok: false; status: ExceptionStatusCode; error: string };
export type APIResponse<T = unknown> = APISuccess<T> | APIError;
