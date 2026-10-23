FILENAME: rateShaper.ts
COMMIT: feat: Add rate shaper iterator utility
```typescript
// src/rateShaper.ts

/**
 * Creates an iterator that shapes the rate of incoming messages and logs their delivery.
 *
 * @param messages - An async iterable of incoming messages.
 * @param maxMessagesPerSecond - The maximum rate of messages to emit.
 * @param log - A function to log each delivery event.
 */
async function* rateShaper(
  messages: AsyncIterable<unknown>,
  maxMessagesPerSecond: number,
  log: (message: unknown) => void
) {
  const queue: unknown[] = [];
  const interval = 1000 / maxMessagesPerSecond;

  async function pushQueue() {
    while (queue.length > 0) {
      const msg = queue.shift();
      if (msg) {
        log(msg);
        yield msg;
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }
  }

  async function* iterator() {
    for await (const msg of messages) {
      queue.push(msg);
      yield* pushQueue();
    }
    yield* pushQueue();
  }

  return iterator();
}
