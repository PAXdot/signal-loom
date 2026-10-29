// src/serialization.ts

/**
 * Serialize payload into a human-readable format.
 *
 * @param payload - The payload to serialize.
 * @returns The serialized payload as a string.
 * @throws Error if the payload type is unsupported.
 */
export function serializePayload(payload: Uint8Array | string): string {
  if (typeof payload === 'string') {
    try {
      return JSON.stringify(JSON.parse(payload));
    } catch {
      return payload;
    }
  }

  if (Buffer.isBuffer(payload)) {
    return payload.toString('base64');
  }

  throw new Error('Unsupported payload type for serialization');
}

/**
 * Deserialize payload based on the target type.
 *
 * @param payload - The payload to deserialize.
 * @param targetType - The target format of the payload ('json' or 'buffer').
 * @returns The deserialized payload as a JSON object or Buffer.
 * @throws Error if the target type is unsupported or the payload is invalid.
 */
export function deserializePayload(payload: string, targetType: 'json' | 'buffer'): unknown | Buffer {
  switch (targetType) {
    case 'json':
      try {
        return JSON.parse(payload);
      } catch {
        throw new Error('Invalid JSON payload');
      }
    case 'buffer':
      const decoded = Buffer.from(payload, 'base64');
      if (Buffer.isBuffer(decoded)) {
        return decoded;
      }
      throw new Error('Invalid buffer payload');
    default:
      throw new Error('Unsupported target type for deserialization');
  }
}
