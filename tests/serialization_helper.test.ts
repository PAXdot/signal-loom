import { expect } from 'node:test';
import assert from 'node:assert';
import { SerializationHelper } from '../src/serialization_helper.js';

describe('SerializationHelper', () => {
  describe('bufferToBase64', () => {
    it('serializes a Buffer to a base64-encoded string correctly', () => {
      const buffer = Buffer.from('hello', 'utf-8');
      const result = SerializationHelper.bufferToBase64(buffer);
      expect(result).toEqual('aGVsbG8=');
    });
  });

  describe('base64ToBuffer', () => {
    it('deserializes a base64-encoded string to a Buffer correctly', () => {
      const base64 = 'aGVsbG8=';
      const result = SerializationHelper.base64ToBuffer(base64);
      expect(result.toString('utf-8')).toEqual('hello');
    });
  });

  describe('calculateSignatureScore', () => {
    it('calculates a signature score based on signature length and data integrity', () => {
      const sig = Buffer.from('abcdefgh', 'hex');
      const data = Buffer.from('secret data', 'utf-8');
      const algo = 'sha256';

      const result = SerializationHelper.calculateSignatureScore(sig, data, algo);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('gives a perfect score if the signature matches the expected hash', () => {
      const sig = Buffer.from('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61d2bcc146', 'hex');
      const data = Buffer.from('The answer is 42', 'utf-8');
      const algo = 'sha256';

      const result = SerializationHelper.calculateSignatureScore(sig, data, algo);
      expect(result).toBe(100);
    });
  });
});
