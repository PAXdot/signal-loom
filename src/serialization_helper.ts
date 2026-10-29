// src/serialization_helper.ts

/**
 * Helper functions for serializing and deserializing data related to signature verification.
 */
export namespace SerializationHelper {
  /**
   * Serialize a Buffer to a base64-encoded string.
   * @param {Buffer} buffer - The buffer to serialize.
   * @returns {string} The base64-encoded string.
   */
  export function bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  /**
   * Deserialize a base64-encoded string to a Buffer.
   * @param {string} base64 - The base64-encoded string to deserialize.
   * @returns {Buffer} The deserialized buffer.
   */
  export function base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
  }

  /**
   * Calculate a signature score based on the given criteria.
   * @param {Buffer} sig - The signature buffer.
   * @param {Buffer} data - The data buffer.
   * @param {string} algo - The hashing algorithm used for signature.
   * @returns {number} The signature score (0-100).
   */
  export function calculateSignatureScore(sig: Buffer, data: Buffer, algo: string): number {
    let score = 0;

    // Check signature length (longer is better)
    score += (100 * sig.length) / 256;

    // Check data integrity using the given algorithm
    const hash = createHash(algo);
    hash.update(data);
    const expectedSig = hash.digest();

    if (expectedSig.length === sig.length && expectedSig.every((val, idx) => val === sig[idx])) {
      score += 50;
    }

    return score;
  }
}
