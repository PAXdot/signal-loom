import { describe, it } from 'node:test';
import assert from 'node:assert';
import { VERSION } from '../src/index.js';

describe('index', () => {
  it('should export VERSION as a string', () => {
    assert.strictEqual(typeof VERSION, 'string');
  });

  it('should have the correct version value', () => {
    assert.strictEqual(VERSION, '0.1.0');
  });

  it('should be a non-empty string', () => {
    assert.ok(VERSION.length > 0);
  });
});
