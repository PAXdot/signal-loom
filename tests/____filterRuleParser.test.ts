import { assert, test } from 'node:test';
import { parseFilterRule, isFilterMatch } from '../___filterRuleParser';

test('parseFilterRule: parses single key-value pair correctly', () => {
  assert.deepEqual(parseFilterRule('type:update'), { type: 'update' });
  assert.deepEqual(parseFilterRule('source:loom'), { source: 'loom' });
});

test('parseFilterRule: parses multiple key-value pairs correctly', () => {
  assert.deepEqual(parseFilterRule('type:update,source:loom'), { type: 'update', source: 'loom' });
});

test('parseFilterRule: parses regex patterns with flags correctly', () => {
  assert.deepEqual(parseFilterRule('type:update,gid:/loom/g'), { type: 'update', gid: /loom/g });
});

test('parseFilterRule: throws error for invalid syntax', () => {
  assert.throws(() => parseFilterRule('invalid:syntax'));
  assert.throws(() => parseFilterRule(''));
  assert.throws(() => parseFilterRule('     '));
});

test('isFilterMatch: matches event against single rule correctly', () => {
  const event = { type: 'update', source: 'loom' };
  assert.ok(isFilterMatch(event, [{ type: 'update' }]));
  assert.ok(isFilterMatch(event, [{ source: 'loom' }]));
});

test('isFilterMatch: matches event against multiple rules correctly', () => {
  const event = { type: 'update', source: 'loom' };
  assert.ok(isFilterMatch(event, [{ type: 'update' }, { source: 'loom' }]));
});

test('isFilterMatch: does not match event against conflicting rules', () => {
  const event = { type: 'create', source: 'loom' };
  assert.notOk(isFilterMatch(event, [{ type: 'update' }, { source: 'loom' }]));
});

test('isFilterMatch: matches event against regex patterns correctly', () => {
  const event = { type: 'loom_update' };
  assert.ok(isFilterMatch(event, [{ type: /^(loom|mesh)_update$/ }]));
});
