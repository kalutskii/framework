// src/api/http.constants.ts
var SUCCESS_STATUS_CODES = [200, 201, 202, 307];
var EXCEPTION_STATUS_CODES = [400, 401, 403, 404, 405, 409, 500];

// src/api/http.factory.ts
function success({ status, data }) {
  return { ok: true, status, data };
}
function voidSuccess({ status }) {
  return { ok: true, status, data: void 0 };
}
function failure({ status, error }) {
  return { ok: false, status, error };
}

// src/errors/errors.constants.ts
var DEFAULT_INTERNAL_ERROR = "Internal server error";

// src/errors/errors.handler.ts
function createErrorHandler(registries) {
  return {
    error(error) {
      for (const registry of registries) {
        for (const { httpCode, Exception } of Object.values(registry)) {
          if (error instanceof Exception) return failure({ status: httpCode, error: error.message });
        }
      }
      return failure({ status: 500, error: DEFAULT_INTERNAL_ERROR });
    }
  };
}

// src/hmac/hmac.constants.ts
var HMAC_SIGNATURE_HEADER_NAME = "X-HMAC-Signature";
var HMAC_TIMESTAMP_HEADER_NAME = "X-HMAC-Timestamp";

// src/hmac/hmac.encryption.ts
import { createHmac } from "crypto";
function signDataWithHMAC(HMACSecret, data = "") {
  const timestamp = Date.now().toString();
  const payload = `${timestamp}.${data}`;
  const signature = createHmac("sha256", HMACSecret).update(payload).digest("hex");
  return { timestamp, signature };
}
function verifyHMACSignature(HMACSecret, data, timestamp, signature) {
  const expectedSignature = createHmac("sha256", HMACSecret).update(`${timestamp}.${data}`).digest("hex");
  return signature === expectedSignature;
}

// src/hmac/hmac.methods.ts
async function signKyRequestWithHMAC(request, HMACSecret) {
  const requestClone = request.clone();
  const bodyClone = await requestClone.text();
  const { timestamp, signature } = signDataWithHMAC(HMACSecret, bodyClone);
  request.headers.set(HMAC_TIMESTAMP_HEADER_NAME, timestamp);
  request.headers.set(HMAC_SIGNATURE_HEADER_NAME, signature);
}

// src/hono/hono.merge.ts
import { Hono } from "hono";
function mergeHonoRouters(options, ...routers) {
  const app = new Hono();
  if (options?.before) for (const hook of options.before) hook(app);
  for (const router of routers) app.route("", router);
  return app;
}
export {
  DEFAULT_INTERNAL_ERROR,
  EXCEPTION_STATUS_CODES,
  HMAC_SIGNATURE_HEADER_NAME,
  HMAC_TIMESTAMP_HEADER_NAME,
  SUCCESS_STATUS_CODES,
  createErrorHandler,
  failure,
  mergeHonoRouters,
  signDataWithHMAC,
  signKyRequestWithHMAC,
  success,
  verifyHMACSignature,
  voidSuccess
};
//# sourceMappingURL=index.js.map