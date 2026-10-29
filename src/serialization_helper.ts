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
}
