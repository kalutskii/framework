import type { APIError, APISuccess, ExceptionStatusCode, SuccessStatusCode } from './http.schemas';

export function success<T = unknown>({ status, data }: { status: SuccessStatusCode; data: T }): APISuccess<T> {
  // Fabric for creating successful API responses (avoiding writing { success: true })
  return { ok: true, status, data };
}

export function voidSuccess({ status }: { status: SuccessStatusCode }): APISuccess<void> {
  // Fabric for creating successful API responses with no data (avoiding writing { success: true })
  return { ok: true, status, data: undefined };
}

export function failure({ status, error }: { status: ExceptionStatusCode; error: string }): APIError {
  // Fabric for creating error API responses (avoiding writing { success: false })
  return { ok: false, status, error };
}
