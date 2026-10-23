// src/rateShaper.ts

import { EventEmitter } from 'node:events';

/**
 * Creates an iterator and an event emitter that shape the rate of incoming messages,
 * logs their delivery, and emits events for rate limiting.
 *
 * @param messages - An async iterable of incoming messages.
 * @param maxMessagesPerSecond - The maximum rate of messages to emit.
 * @param log - A function to log each delivery event.
 */
class RateShaper extends EventEmitter {
  private queue: unknown[] = [];
  private interval: number;
  private pushQueueResolve: (value: unknown) => void;

  constructor(
    private messages: AsyncIterable<unknown>,
    maxMessagesPerSecond: number,
    private log: (message: unknown) => void
  ) {
    super();
    this.interval = 1000 / maxMessagesPerSecond;
    this.pushQueueResolve = undefined;
  }

  /**
   * Pushes items from the queue at the specified rate and emits 'rateLimited' events
   * when the queue size exceeds `maxMessagesPerSecond * interval`.
   */
  private async pushQueue() {
    while (this.queue.length > 0) {
      const msg = this.queue.shift();
      if (msg) {
        this.log(msg);
        this.emit('delivered', msg);
        await new Promise((resolve) => {
          this.pushQueueResolve = resolve;
          setTimeout(resolve, this.interval);
        });
      }
    }
    this.pushQueueResolve = undefined;
  }

  /**
   * Iterates over the incoming messages, pushing them into the queue and calling `pushQueue`
   * when necessary.
   */
  async* iterator() {
    for await (const msg of this.messages) {
      this.queue.push(msg);
      if (this.pushQueueResolve && this.queue.length > this.maxMessagesPerSecond * this.interval) {
        this.emit('rateLimited');
      } else {
        this.pushQueueResolve?.();
      }
      yield* this.pushQueue();
    }
    yield* this.pushQueue();
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
