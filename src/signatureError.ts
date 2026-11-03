import crypto from 'node:crypto';

export class SignatureVerificationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidSignatureError extends SignatureVerificationError {
  constructor() {
    super('Invalid signature');
  }
}

export class MissingSignatureError extends SignatureVerificationError {
  constructor() {
    super('Missing signature');
  }
}

export function verifySignature(
  data: Buffer,
  signature: string,
  publicKey: string
): void {
  const hashed = crypto.createHash('sha256').update(data).digest('hex');
  try {
    if (crypto.verify('sha256', Buffer.from(hashed), publicKey, signature)) {
      return;
    }
  } catch {
    throw new InvalidSignatureError();
  }
  throw new InvalidSignatureError();
}
