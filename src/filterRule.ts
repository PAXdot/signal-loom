import { strictEqual, deepStrictEqual } from 'node:assert';
import { describe, it } from 'node:test';

/**
 * A compact data structure representing a filtering rule.
 * A rule matches if the condition evaluates to true on the payload.
 */
export interface FilterRule {
  /** Unique identifier for the rule */
  id: string;
  /** Field path to evaluate, e.g. "event.type" */
  field: string;
  /** Operator for comparison */
  op: 'eq' | 'neq' | 'exists' | 'not_exists';
  /** Value to compare against (optional for exists/not_exists) */
  value?: unknown;
}

/**
 * Evaluates a filter rule against a payload object.
 * Returns true if the rule matches, false otherwise.
 */
export function evaluateFilterRule(rule: FilterRule, payload: Record<string, unknown>): boolean {
  const fieldValue = getFieldValue(payload, rule.field);

  switch (rule.op) {
    case 'eq':
      return fieldValue === rule.value;
    case 'neq':
      return fieldValue !== rule.value;
    case 'exists':
      return fieldValue !== undefined;
    case 'not_exists':
      return fieldValue === undefined;
    default:
      return false;
  }
}

/**
 * Retrieves a nested field value from an object using dot notation.
 */
function getFieldValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

describe('filterRule', () => {
  it('evaluates eq rule', () => {
    const rule: FilterRule = { id: '1', field: 'event.type', op: 'eq', value: 'created' };
    strictEqual(evaluateFilterRule(rule, { event: { type: 'created' } }), true);
    strictEqual(evaluateFilterRule(rule, { event: { type: 'updated' } }), false);
  });

  it('evaluates neq rule', () => {
    const rule: FilterRule = { id: '2', field: 'event.type', op: 'neq', value: 'deleted' };
    strictEqual(evaluateFilterRule(rule, { event: { type: 'created' } }), true);
    strictEqual(evaluateFilterRule(rule, { event: { type: 'deleted' } }), false);
  });

  it('evaluates exists rule', () => {
    const rule: FilterRule = { id: '3', field: 'metadata.traceId', op: 'exists' };
    strictEqual(evaluateFilterRule(rule, { metadata: { traceId: 'abc' } }), true);
    strictEqual(evaluateFilterRule(rule, { metadata: {} }), false);
  });

  it('evaluates not_exists rule', () => {
    const rule: FilterRule = { id: '4', field: 'metadata.traceId', op: 'not_exists' };
    strictEqual(evaluateFilterRule(rule, { metadata: {} }), true);
    strictEqual(evaluateFilterRule(rule, { metadata: { traceId: 'abc' } }), false);
  });

  it('handles missing nested path', () => {
    const rule: FilterRule = { id: '5', field: 'a.b.c', op: 'exists' };
    strictEqual(evaluateFilterRule(rule, { a: { b: {} } }), false);
  });

  it('handles null intermediate values', () => {
    const rule: FilterRule = { id: '6', field: 'a.b', op: 'exists' };
    strictEqual(evaluateFilterRule(rule, { a: null }), false);
  });
});
