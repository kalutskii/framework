import { KyRequest } from 'ky';
import { Hono } from 'hono';
import { BlankEnv } from 'hono/types';

declare const SUCCESS_STATUS_CODES: readonly [200, 201, 202, 307];
declare const EXCEPTION_STATUS_CODES: readonly [400, 401, 403, 404, 405, 409, 500];

type SuccessStatusCode = (typeof SUCCESS_STATUS_CODES)[number];
type ExceptionStatusCode = (typeof EXCEPTION_STATUS_CODES)[number];
type APISuccess<T = void> = {
    ok: true;
    status: SuccessStatusCode;
    data: T;
};
type APIError = {
    ok: false;
    status: ExceptionStatusCode;
    error: string;
};
type APIResponse<T = unknown> = APISuccess<T> | APIError;

declare function success<T = unknown>({ status, data }: {
    status: SuccessStatusCode;
    data: T;
}): APISuccess<T>;
declare function voidSuccess({ status }: {
    status: SuccessStatusCode;
}): APISuccess<void>;
declare function failure({ status, error }: {
    status: ExceptionStatusCode;
    error: string;
}): APIError;

declare const DEFAULT_INTERNAL_ERROR = "Internal server error";

type HandlerError = Record<string, {
    httpCode: ExceptionStatusCode;
    Exception: abstract new (...args: any[]) => Error;
}>;

declare function createErrorHandler(registries: HandlerError[]): {
    error(error: Error): APIError;
};

declare const HMAC_SIGNATURE_HEADER_NAME = "X-HMAC-Signature";
declare const HMAC_TIMESTAMP_HEADER_NAME = "X-HMAC-Timestamp";

declare function signDataWithHMAC(HMACSecret: string, data?: string): {
    timestamp: string;
    signature: string;
};
declare function verifyHMACSignature(HMACSecret: string, data: string, timestamp: string, signature: string): boolean;

declare function signKyRequestWithHMAC(request: KyRequest, HMACSecret: string): Promise<void>;

type MergeHonoSchemas<R extends readonly Hono<any, any, any>[]> = {
    [K in R[number] as K extends Hono<any, infer Schema, any> ? keyof Schema : never]: K extends Hono<any, infer Schema, any> ? Schema[keyof Schema] : never;
};
declare function mergeHonoRouters<const R extends readonly Hono<any, any, any>[]>(options: {
    before?: ((app: Hono) => void)[];
} | undefined, ...routers: R): Hono<BlankEnv, MergeHonoSchemas<R>, '/'>;

type SerializeDates<T> = T extends Date ? string : T extends (infer U)[] ? SerializeDates<U>[] : T extends readonly (infer U)[] ? readonly SerializeDates<U>[] : T extends object ? {
    [K in keyof T]: SerializeDates<T[K]>;
} : T;

export { type APIError, type APIResponse, type APISuccess, DEFAULT_INTERNAL_ERROR, EXCEPTION_STATUS_CODES, type ExceptionStatusCode, HMAC_SIGNATURE_HEADER_NAME, HMAC_TIMESTAMP_HEADER_NAME, type HandlerError, type MergeHonoSchemas, SUCCESS_STATUS_CODES, type SerializeDates, type SuccessStatusCode, createErrorHandler, failure, mergeHonoRouters, signDataWithHMAC, signKyRequestWithHMAC, success, verifyHMACSignature, voidSuccess };
