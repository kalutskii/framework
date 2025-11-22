import type { KyRequest } from 'ky';

import { HMAC_SIGNATURE_HEADER_NAME, HMAC_TIMESTAMP_HEADER_NAME } from './hmac.constants';
import { signDataWithHMAC } from './hmac.encryption';

async function signKyRequestWithHMAC(request: KyRequest, HMACSecret: string) {
  // Signing ky request with HMAC and setting relevant headers

  const requestClone = request.clone();
  const bodyClone = await requestClone.text();

  const { timestamp, signature } = signDataWithHMAC(HMACSecret, bodyClone);
  request.headers.set(HMAC_TIMESTAMP_HEADER_NAME, timestamp);
  request.headers.set(HMAC_SIGNATURE_HEADER_NAME, signature);
}

export { signKyRequestWithHMAC };
