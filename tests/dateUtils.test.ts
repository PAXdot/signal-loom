import { test, expect } from 'node:test';
import { parseDateTime, formatDateTime, now, nowTimestamp, toTimestamp, isWithinRange, isAfter, isBefore, addDuration, diffMilliseconds, diffSeconds } from '../src/dateUtils.ts';

test('parseDateTime', async () => {
  expect(parseDateTime('2022-12-31T23:59:59.999Z')).toStrictEqual(new Date('2022-12-31T23:59:59.999Z'));
  expect(parseDateTime(1672559199000)).toStrictEqual(new Date('2022-12-31T23:59:59.000Z'));
  expect(parseDateTime('2022-12-31')).toStrictEqual(new Date('2022-12-31T00:00:00.000Z'));
  expect(parseDateTime('2022-12-31 23:59:59')).toStrictEqual(new Date('2022-12-31T23:59:59.000Z'));
  expect(parseDateTime('invalid')).toBeNull();
});

test('formatDateTime', async () => {
  expect(formatDateTime(new Date('2022-12-31T23:59:59.999Z'))).toBe('2022-12-31T23:59:59.999Z');
  expect(formatDateTime(new Date('NaN'))).toBeNull();
});

test('now and nowTimestamp', async () => {
  const nowDate = new Date();
  expect(formatDateTime(nowDate)).toBe(now());
  expect(nowTimestamp()).toBeCloseTo(nowDate.getTime(), -1);
});

test('toTimestamp', async () => {
  expect(toTimestamp(new Date('2022-12-31T23:59:59.999Z'))).toBe(1672559199999);
  expect(toTimestamp('2022-12-31T23:59:59.999Z')).toBe(1672559199999);
  expect(toTimestamp('invalid')).toBe(-1);
});

test('isWithinRange', async () => {
  expect(isWithinRange('2022-12-31T23:59:59.999Z', '2022-12-31T00:00:00.000Z', '2022-12-31T23:59:59.999Z')).toBe(true);
  expect(isWithinRange('invalid', '2022-12-31T00:00:00.000Z', '2022-12-31T23:59:59.999Z')).toBe(false);
});

test('isAfter and isBefore', async () => {
  expect(isAfter('2022-12-31T23:59:59.999Z', '2022-12-31T00:00:00.000Z')).toBe(true);
  expect(isBefore('2022-12-31T00:00:00.000Z', '2022-12-31T23:59:59.999Z')).toBe(true);
  expect(isAfter('invalid', '2022-12-31T00:00:00.000Z')).toBe(false);
});

test('addDuration', async () => {
  expect(addDuration('2022-12-31T23:59:59.999Z', 1000)).toBe('2022-12-31T23:59:60.999Z');
  expect(addDuration('invalid', 1000)).toBeNull();
});

test('diffMilliseconds and diffSeconds', async () => {
  expect(diffMilliseconds('2022-12-31T23:59:59.999Z', '2022-12-31T00:00:00.000Z')).toBe(86399999);
  expect(diffSeconds('2022-12-31T23:59:59.999Z', '2022-12-31T00:00:00.000Z')).toBe(86400);
  expect(diffMilliseconds('invalid', '2022-12-31T00:00:00.000Z')).toBeNaN();
});
