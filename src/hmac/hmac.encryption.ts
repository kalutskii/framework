import { createHmac } from 'crypto';

export function signDataWithHMAC(HMACSecret: string, data: string = ''): { timestamp: string; signature: string } {
  // Signs an HMAC request using the provided HMAC secret and request body and
  // returns an object containing the timestamp and signature for assigning to headers

  const timestamp = Date.now().toString();
  const payload = `${timestamp}.${data}`;
  const signature = createHmac('sha256', HMACSecret).update(payload).digest('hex');

  return { timestamp, signature };
}

export function verifyHMACSignature(HMACSecret: string, data: string, timestamp: string, signature: string): boolean {
  const expectedSignature = createHmac('sha256', HMACSecret).update(`${timestamp}.${data}`).digest('hex');
  return signature === expectedSignature;
}
