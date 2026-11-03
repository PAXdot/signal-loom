import { strict as assert } from 'node:assert';

/**
 * A generator-based iterator that applies a sequence of transform functions
 * to a payload. Each transform receives the current value and returns a new one.
 * Supports early termination if a transform returns undefined.
 */
export function* payloadTransformIterator<T>(
  initial: T,
  transforms: Array<(value: T) => T | undefined>
): Generator<T, void, unknown> {
  let current = initial;
  for (const transform of transforms) {
    const next = transform(current);
    if (next === undefined) {
      return;
    }
    current = next;
    yield current;
  }
}

/**
 * Compose multiple transforms into a single function.
 * Returns undefined if any transform returns undefined.
 */
export function composePayloadTransforms<T>(
  ...transforms: Array<(value: T) => T | undefined>
): (value: T) => T | undefined {
  return (value: T): T | undefined => {
    let current = value;
    for (const transform of transforms) {
      const next = transform(current);
      if (next === undefined) {
        return undefined;
      }
      current = next;
    }
    return current;
  };
}

/**
 * Apply transforms and collect all intermediate states.
 * Returns an array of all states, including the initial.
 */
export function collectPayloadTransforms<T>(
  initial: T,
  transforms: Array<(value: T) => T | undefined>
): T[] {
  const states: T[] = [initial];
  let current = initial;
  for (const transform of transforms) {
    const next = transform(current);
    if (next === undefined) {
      break;
    }
    current = next;
    states.push(current);
  }
  return states;
}
