import { strict as assert } from 'node:assert';

// ─── Types ───────────────────────────────────────────────────────────────────
export type DlqEntry = {
  readonly id: string;
  readonly originalPayload: unknown;
  readonly error: string;
  readonly timestamp: number;
  readonly retryCount: number;
};

export type RetryDlqState = {
  readonly entries: readonly DlqEntry[];
  readonly version: number;
};

// ─── Serialization helpers ───────────────────────────────────────────────────
const CURRENT_VERSION = 1;

/** Serialize a RetryDlqState to a JSON string, validating the state structure. */
export function serializeRetryDlqState(state: RetryDlqState): string {
  assertIsRetryDlqState(state);
  return JSON.stringify(state);
}

/** Deserialize a JSON string back to a RetryDlqState, performing basic validation. */
export function deserializeRetryDlqState(json: string): RetryDlqState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON for RetryDlqState');
  }
  assertIsRetryDlqState(parsed);
  return parsed;
}

/** Serialize a single DLQ entry to a compact JSON string. */
export function serializeDlqEntry(entry: DlqEntry): string {
  assertIsDlqEntry(entry);
  return JSON.stringify(entry);
}

/** Deserialize a single DLQ entry from a JSON string. */
export function deserializeDlqEntry(json: string): DlqEntry {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON for DlqEntry');
  }
  assertIsDlqEntry(parsed);
  return parsed;
}

// ─── Internal validators ─────────────────────────────────────────────────────
function assertIsRetryDlqState(value: unknown): asserts value is RetryDlqState {
  if (typeof value !== 'object' || value === null) {
    throw new Error('RetryDlqState must be a non-null object');
  }
  const obj = value as Record<string, unknown>;
  if (!Array.isArray(obj.entries)) {
    throw new Error('RetryDlqState.entries must be an array');
  }
  for (const entry of obj.entries) {
    assertIsDlqEntry(entry);
  }
  if (typeof obj.version !== 'number' || obj.version !== CURRENT_VERSION) {
    throw new Error(`RetryDlqState.version must be ${CURRENT_VERSION}`);
  }
}

function assertIsDlqEntry(value: unknown): asserts value is DlqEntry {
  if (typeof value !== 'object' || value === null) {
    throw new Error('DlqEntry must be a non-null object');
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.id !== 'string' || obj.id.length === 0) {
    throw new Error('DlqEntry.id must be a non-empty string');
  }
  if (typeof obj.error !== 'string') {
    throw new Error('DlqEntry.error must be a string');
  }
  if (typeof obj.timestamp !== 'number' || !Number.isFinite(obj.timestamp)) {
    throw new Error('DlqEntry.timestamp must be a finite number');
  }
  if (typeof obj.retryCount !== 'number' || !Number.isInteger(obj.retryCount) || obj.retryCount < 0) {
    throw new Error('DlqEntry.retryCount must be a non-negative integer');
  }
  // originalPayload can be any value, including undefined/null
}
