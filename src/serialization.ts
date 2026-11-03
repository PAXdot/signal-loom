import { EventEmitter } from 'node:events';
import * as z from 'zod';
import { delay } from 'node:timers/promises';

/**
 * Validate the payload against a provided Zod schema with built-in retries and exponential backoff for signature verification.
 *
 * @param payload - The payload to validate.
 * @param schema - The Zod schema to validate against.
 * @param maxRetries - Maximum number of retries for signature verification (default: 3).
 * @param initialBackoffMs - Initial milliseconds to wait between retries (default: 500ms).
 * @param maxBackoffMs - Maximum milliseconds to wait between retries (default: 5000ms).
 * @param emitter - An optional event emitter to dispatch validation results.
 * @returns The validated payload if valid, throws an error otherwise.
 */
export async function validatePayload<T extends z.ZodSchema>(
  payload: unknown,
  schema: T,
  maxRetries = 3,
  initialBackoffMs = 500,
  maxBackoffMs = 5000,
  emitter?: EventEmitter
): Promise<z.infer<T>> {
  let retries = 0;
  let backoffMs = initialBackoffMs;

  while (retries < maxRetries) {
    const result = schema.safeParse(payload);

    if (result.success) {
      if (emitter) {
        emitter.emit('payloadValid', result.data);
      }
      return result.data;
    }

    const isSignatureVerifyError = result.error.issues.some(issue => issue.code === 'invalid_signature');

    if (!isSignatureVerifyError || backoffMs > maxBackoffMs) {
      break;
    }

    retries++;
    backoffMs = Math.min(backoffMs * 2, maxBackoffMs);
    await delay(backoffMs);
  }

  if (emitter) {
    emitter.emit('payloadInvalid', result.error);
  }

  throw new Error(`Payload validation failed: ${result.error.message}`);
}

// ... rest of the file remains unchanged
