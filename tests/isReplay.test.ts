import { test, assert, mockHeaders } from 'node:test';
import { isPotentialReplay } from '../src/isReplay.ts';

test('should return true for non-empty replay-id header', () => {
  const headers = mockHeaders({
    'replay-id': '  replay-123  ',
  });
  assert.equal(isPotentialReplay(headers), true);
});

test('should return false for empty replay-id header', () => {
  const headers = mockHeaders({});
  assert.equal(isPotentialReplay(headers), false);
});

test('should return false for replay-id header with only whitespace', () => {
  const headers = mockHeaders({
    'replay-id': '      ',
  });
  assert.equal(isPotentialReplay(headers), false);
});

test('should return false for missing replay-id header', () => {
  const headers = mockHeaders({});
  assert.equal(isPotentialReplay(headers), false);
});

test('should strip special characters and trim whitespace from replay-id header', () => {
  const headers = mockHeaders({
    'replay-id': ' replay-123__  ',
  });
  assert.equal(isPotentialReplay(headers), true);
});

test('should handle uppercase replay-id header', () => {
  const headers = mockHeaders({
    'REPLAY-ID': '  replay-123  ',
  });
  assert.equal(isPotentialReplay(headers), true);
});
