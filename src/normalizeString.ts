/**
 * Normalize a string by removing leading/trailing whitespace and converting to lowercase.
 * @param str - The string to normalize.
 * @returns The normalized string.
 */
function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

/**
 * Convert a Buffer to base64 string.
 * @param buf - The Buffer to convert.
 * @returns The base64 string.
 */
function bufferToBase64(buf: Buffer): string {
  return buf.toString('base64');
}

// <topic>.test.ts
import { bufferToBase64 } from './normalizeString';

describe('bufferToBase64', () => {
  it('converts a valid Buffer to base64', () => {
    const buf = Buffer.from('hello world');
    assert.strictEqual(bufferToBase64(buf), 'aGVsbG8gd29ybGQ=');
  });

  it('throws for invalid base64 input', () => {
    const invalidBuf = Buffer.from('invalid');
    assert.throws(() => bufferToBase64(invalidBuf), {
      message: 'Invalid base64 input',
    });
  });
});
