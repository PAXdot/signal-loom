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
  op: 'eq' | 'neq' | 'exists' | 'not_exists' | 'starts_with' | 'ends_with' | 'contains';
  /** Value to compare against (optional for exists/not_exists) */
  value?: string;
}

/**
 * Decorator to memoize function results based on input arguments.
 */
function memoize(fn: Function) {
  const cache = new Map<string, Map<string, unknown>>();
  return (...args: any) => {
    const cacheKey = args.map(JSON.stringify).join(',');
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, new Map());
    }
    const resultCache = cache.get(cacheKey);
    if (resultCache && resultCache.has(fn.name)) {
      return resultCache.get(fn.name);
    }
    const result = fn(...args);
    resultCache?.set(fn.name, result);
    return result;
  };
}

/**
 * Serializes a FilterRule object to a JSON-stringifiable object.
 */
export function serializeFilterRule(rule: FilterRule): Record<string, unknown> {
  const { id, field, op, value } = rule;
  return { id, field, op, value: value?.toString() };
}

/**
 * Deserializes a JSON-stringifiable object to a FilterRule.
 */
export function deserializeFilterRule(obj: Record<string, unknown>): FilterRule {
  const { id, field, op, value } = obj;
  return { id, field, op, value: value ? (typeof value === 'string' ? value : undefined) : undefined };
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
    case 'starts_with':
    case 'ends_with':
    case 'contains':
      if (typeof fieldValue !== 'string') return false;
      switch (rule.op) {
        case 'starts_with':
          return (fieldValue as string).startsWith(rule.value as string);
        case 'ends_with':
          return (fieldValue as string).endsWith(rule.value as string);
        case 'contains':
          return (fieldValue as string).includes(rule.value as string);
        default:
          return false;
      }
    default:
      return false;
  }
}

evaluateFilterRule = memoize(evaluateFilterRule);

/**
 * Retrieves a nested field value from an object using dot notation.
 */
function getFieldValue(obj: Record<string, unknown>, path: string): unknown {
  // ... (remains the same)
}

// ... (tests remain the same, but consider adding some for the new serialization functions)
