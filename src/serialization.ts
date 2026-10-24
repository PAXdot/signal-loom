// src/serialization.ts

export function serializePayload(payload: Uint8Array | string): string {
  if (typeof payload === 'string') {
    try {
      // Try JSON parsing and stringify for simple JSON payloads
      return JSON.stringify(JSON.parse(payload));
    } catch (err) {
      // If not JSON, consider it as a string and leave it as is
      return payload;
    }
  }
  if (Buffer.isBuffer(payload)) {
    return payload.toString('base64');
  }
  throw new Error('Unsupported payload type for serialization');
}

export function deserializePayload(payload: string, targetType: 'json' | 'buffer'): unknown | Buffer {
  if (targetType === 'json') {
    try {
      return JSON.parse(payload);
    } catch (err) {
      throw new Error('Invalid JSON payload');
    }
  }
  if (targetType === 'buffer') {
    const decoded = Buffer.from(payload, 'base64');
    if (Buffer.isBuffer(decoded)) {
      return decoded;
    }
    throw new Error('Invalid buffer payload');
  }
  throw new Error('Unsupported target type for deserialization');
}
