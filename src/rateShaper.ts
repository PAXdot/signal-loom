import { EventEmitter } from 'node:events';

/**
 * Creates an iterator and an event emitter that shape the rate of incoming messages,
 * logs their delivery in a human-readable format, and emits events for rate limiting.
 *
 * @param messages - An async iterable of incoming messages.
 * @param maxMessagesPerSecond - The maximum rate of messages to emit.
 * @param log - A function to log each delivery event.
 */
class RateShaper extends EventEmitter {
  private queue: unknown[] = [];
  private interval: number;
  private pushQueueTimer: NodeJS.Timeout | undefined;

  constructor(
    private messages: AsyncIterable<unknown>,
    private maxMessagesPerSecond: number,
    private log: (message: unknown) => void
  ) {
    super();
    this.interval = 1000 / maxMessagesPerSecond;
  }

  /**
   * Pushes items from the queue at the specified rate and emits 'rateLimited' events
   * when the queue size exceeds `maxMessagesPerSecond * interval`.
   */
  private async pushQueue() {
    while (this.queue.length > 0) {
      const msg = this.queue.shift();
      if (msg) {
        this.log(`Delivered: ${JSON.stringify(msg)}`);
        this.emit('delivered', msg);
        await this.sleep(this.interval);
        if (this.queue.length > this.maxMessagesPerSecond * this.interval) {
          this.emit('rateLimited');
        }
      }
    }
    this.pushQueueTimer = undefined;
  }

  /**
   * Sleeps for the given duration.
   *
   * @param ms - The duration to sleep in milliseconds.
   */
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Iterates over the incoming messages, pushing them into the queue and calling `pushQueue`
   * when necessary. Clears pending timers and handles edge cases for the last batch of messages.
   */
  async* iterator() {
    for await (const msg of this.messages) {
      this.queue.push(msg);
      if (this.pushQueueTimer && this.queue.length > this.maxMessagesPerSecond * this.interval) {
        this.emit('rateLimited');
      } else {
        this.clearPendingTimer();
      }
      yield* this.pushQueue();
    }
    // Process any remaining messages in the queue after the async iterable is exhausted.
    this.clearPendingTimer();
    yield* this.pushQueue();
  }

  /**
   * Clears the pending timer, if one exists.
   */
  private clearPendingTimer() {
    if (this.pushQueueTimer) {
      clearTimeout(this.pushQueueTimer);
      this.pushQueueTimer = undefined;
    }
  }

  /**
   * Starts the rate shaping and message delivery process.
   */
  start() {
    this.emit('start');
    this.messages[Symbol.asyncIterator]().next().then((result) => {
      if (result.done) return;
      void this.iterator().next();
    });
  }
}
