import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FilterRuleError,
  FilterEvaluationError,
  FilterValidationError,
  FilterFieldError,
  isFilterRuleError,
  toFilterRuleError,
} from '../src/filterRuleErrors.js';

describe('FilterRuleError', () => {
  it('should create an error with the correct name, message, and ruleId', () => {
    const error = new FilterRuleError('test message', 'rule-1');
    assert.equal(error.name, 'FilterRuleError');
    assert.equal(error.message, 'test message');
    assert.equal(error.ruleId, 'rule-1');
    assert.equal(error.cause, undefined);
  });

  it('should store the cause when provided', () => {
    const cause = new Error('inner');
    const error = new FilterRuleError('test', 'rule-2', { cause });
    assert.equal(error.cause, cause);
  });
});

describe('FilterEvaluationError', () => {
  it('should create an error with name FilterEvaluationError and payloadPath', () => {
    const error = new FilterEvaluationError('eval error', 'rule-3', { payloadPath: '$.data' });
    assert.equal(error.name, 'FilterEvaluationError');
    assert.equal(error.ruleId, 'rule-3');
    assert.equal(error.payloadPath, '$.data');
  });

  it('should inherit cause from FilterRuleError', () => {
    const cause = new Error('inner');
    const error = new FilterEvaluationError('eval', 'rule-4', { cause });
    assert.equal(error.cause, cause);
  });

  it('should allow optional payloadPath', () => {
    const error = new FilterEvaluationError('eval', 'rule-5');
    assert.equal(error.payloadPath, undefined);
  });
});

describe('FilterValidationError', () => {
  it('should create an error with name FilterValidationError and ruleType', () => {
    const error = new FilterValidationError('invalid', 'rule-6', 'jsonpath');
    assert.equal(error.name, 'FilterValidationError');
    assert.equal(error.ruleId, 'rule-6');
    assert.equal(error.ruleType, 'jsonpath');
  });
});

describe('FilterFieldError', () => {
  it('should create an error with name FilterFieldError and field', () => {
    const error = new FilterFieldError('field missing', 'rule-7', '$.user.id');
    assert.equal(error.name, 'FilterFieldError');
    assert.equal(error.ruleId, 'rule-7');
    assert.equal(error.field, '$.user.id');
    assert.equal(error.payloadPath, undefined);
  });

  it('should inherit payloadPath from FilterEvaluationError', () => {
    const error = new FilterFieldError('field missing', 'rule-8', '$.data', { cause: undefined });
    assert.equal(error.payloadPath, undefined);
  });

  it('should store cause', () => {
    const cause = new Error('inner');
    const error = new FilterFieldError('field missing', 'rule-9', '$.x', { cause });
    assert.equal(error.cause, cause);
  });
});

describe('isFilterRuleError', () => {
  it('should return true for FilterRuleError instances', () => {
    assert.equal(isFilterRuleError(new FilterRuleError('msg', 'r')), true);
  });

  it('should return true for subclasses', () => {
    assert.equal(isFilterRuleError(new FilterEvaluationError('msg', 'r')), true);
    assert.equal(isFilterRuleError(new FilterValidationError('msg', 'r', 't')), true);
    assert.equal(isFilterRuleError(new FilterFieldError('msg', 'r', 'f')), true);
  });

  it('should return false for other errors', () => {
    assert.equal(isFilterRuleError(new Error('msg')), false);
  });

  it('should return false for non-errors', () => {
    assert.equal(isFilterRuleError(null), false);
    assert.equal(isFilterRuleError('string'), false);
    assert.equal(isFilterRuleError(42), false);
  });
});

describe('toFilterRuleError', () => {
  it('should return the same error if already a FilterRuleError', () => {
    const original = new FilterRuleError('msg', 'r');
    const result = toFilterRuleError(original, 'r');
    assert.equal(result, original);
  });

  it('should return the same error for subclasses', () => {
    const original = new FilterEvaluationError('msg', 'r');
    const result = toFilterRuleError(original, 'r');
    assert.equal(result, original);
  });

  it('should wrap a plain Error into FilterEvaluationError', () => {
    const cause = new Error('inner');
    const result = toFilterRuleError(cause, 'rule-10');
    assert.ok(result instanceof FilterEvaluationError);
    assert.equal(result.message, 'Unexpected filter rule error');
    assert.equal(result.ruleId, 'rule-10');
    assert.equal(result.cause, cause);
  });

  it('should wrap a non-Error value into FilterEvaluationError with undefined cause', () => {
    const result = toFilterRuleError('not an error', 'rule-11');
    assert.ok(result instanceof FilterEvaluationError);
    assert.equal(result.message, 'Unexpected filter rule error');
    assert.equal(result.ruleId, 'rule-11');
    assert.equal(result.cause, undefined);
  });

  it('should wrap null into FilterEvaluationError with undefined cause', () => {
    const result = toFilterRuleError(null, 'rule-12');
    assert.ok(result instanceof FilterEvaluationError);
    assert.equal(result.cause, undefined);
  });
});
