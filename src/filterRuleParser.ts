/**
 * Parses a raw filter rule expression string into structured conditions.
 * Supports simple key-value comparisons: key OPERATOR value.
 * Operators: eq, neq, gt, gte, lt, lte, in, notin, exists, regex.
 * Multiple conditions separated by comma act as AND.
 */
export interface FilterCondition {
  key: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notin' | 'exists' | 'regex';
  value: string;
}

const OPERATOR_REGEX = /\b(eq|neq|gt|gte|lt|lte|in|notin|exists|regex)\b/;

/** Parses a filter rule string into an array of conditions. Throws on invalid syntax. */
export function parseFilterRule(rule: string): FilterCondition[] {
  if (typeof rule !== 'string' || rule.trim().length === 0) {
    throw new Error('Filter rule must be a non-empty string');
  }

  const parts = rule.split(',').map(p => p.trim()).filter(Boolean);
  const conditions: FilterCondition[] = [];

  for (const part of parts) {
    const match = part.match(OPERATOR_REGEX);
    if (!match) {
      throw new Error(`Invalid filter condition: "${part}" — no valid operator found`);
    }

    const operatorIndex = match.index!;
    const operator = match[1] as FilterCondition['operator'];
    const key = part.slice(0, operatorIndex).trim();
    const value = part.slice(operatorIndex + operator.length).trim();

    if (key.length === 0) {
      throw new Error(`Invalid filter condition: "${part}" — key is empty`);
    }

    conditions.push({ key, operator, value });
  }

  return conditions;
}
