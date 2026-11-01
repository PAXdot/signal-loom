/**
 * A generator that retries a given task with exponential backoff and handles dead-letter queues.
 * @template T - The type of the task that is being retried.
 * @param task - The function that will be retried.
 * @param deadLetterQueue - A function to handle failed attempts and log them.
 * @param retryPolicy - An object defining the retry policy.
 * @returns A generator that yields the result of the task once it succeeds or throws an error.
 */
export function* retryIterator<T>(
  task: () => Promise<T>,
  deadLetterQueue: (error: Error, attempt: number) => void,
  retryPolicy: { maxAttempts: number; backoffFactor: number },
): Generator<{ value: T } | { error: Error }> {
  let attempt = 1;
  while (attempt <= retryPolicy.maxAttempts) {
    try {
      const result = yield { value: (await task()) };
      return result;
    } catch (error) {
      deadLetterQueue(error, attempt);
      const delay = retryPolicy.backoffFactor * Math.pow(2, attempt - 1);
      yield { error };
      attempt++;
      yield { value: new Promise((resolve) => setTimeout(resolve, delay)) };
    }
  }
  throw new Error(`Failed after ${retryPolicy.maxAttempts} attempts.`);
}
