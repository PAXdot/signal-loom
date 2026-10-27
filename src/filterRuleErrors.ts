/**
 * Custom error type for filter rule evaluation and validation.
 */
export class FilterRuleError extends Error {
  readonly ruleId: string;
  readonly cause?: Error;

  constructor(message: string, ruleId: string, options?: { cause?: Error }) {
    super(message);
    this.name = 'FilterRuleError';
    this.ruleId = ruleId;
    this.cause = options?.cause;
  }
}

/**
 * Error raised when a filter rule fails to evaluate against an event payload.
 */
export class FilterEvaluationError extends FilterRuleError {
  readonly payloadPath?: string;

  constructor(message: string, ruleId: string, options?: { cause?: Error; payloadPath?: string }) {
    super(message, ruleId, { cause: options?.cause });
    this.name = 'FilterEvaluationError';
    this.payloadPath = options?.payloadPath;
  }
}

/**
 * Error raised when a filter rule is syntactically or semantically invalid.
 */
export class FilterValidationError extends FilterRuleError {
  readonly ruleType: string;

  constructor(message: string, ruleId: string, ruleType: string) {
    super(message, ruleId);
    this.name = 'FilterValidationError';
    this.ruleType = ruleType;
  }
}

/**
 * Error raised when a filter rule references a non-existent or unsupported field.
 */
export class FilterFieldError extends FilterEvaluationError {
  readonly field: string;

  constructor(message: string, ruleId: string, field: string, options?: { cause?: Error }) {
    super(message, ruleId, { cause: options?.cause });
    this.name = 'FilterFieldError';
    this.field = field;
  }
}

/**
 * Type guard to check if an unknown error is a FilterRuleError.
 */
export function isFilterRuleError(error: unknown): error is FilterRuleError {
  return error instanceof FilterRuleError;
}

/**
 * Normalize an unknown error into a FilterRuleError if not already one.
 */
export function toFilterRuleError(error: unknown, ruleId: string): FilterRuleError {
  if (error instanceof FilterRuleError) {
    return error;
  }
  const cause = error instanceof Error ? error : undefined;
  return new FilterEvaluationError('Unexpected filter rule error', ruleId, { cause });
}
