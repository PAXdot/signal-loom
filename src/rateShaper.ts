import { EventEmitter } from 'node:events';
import { format, utcToZonedTime } from 'date-fns-tz';

/**
 * Creates an iterator and an event emitter that shape the rate of incoming messages,
 * logs their delivery in a human-readable format with timestamps, and emits events for rate limiting.
 *
 * @param messages - An async iterable of incoming messages.
 * @param maxMessagesPerSecond - The maximum rate of messages to emit.
 * @param log - A function to log each delivery event.
 * @param timezone - The timezone for logging timestamps (default: UTC).
 */
class RateShaper extends EventEmitter {
  private queue: unknown[] = [];
  private interval: number;
  private pushQueueTimer: NodeJS.Timeout | undefined;

  constructor(
    private messages: AsyncIterable<unknown>,
    private maxMessagesPerSecond: number,
    private log: (message: unknown) => void,
    private timezone = 'UTC'
  ) {
    super();
    this.interval = 1000 / maxMessagesPerSecond;
  }

  /**
   * Logs a message with a timestamp in the specified timezone.
   *
   * @param message - The message to log.
   * @param timestamp - The timestamp to use for logging (default: now).
   */
  private logWithTimestamp(message: unknown, timestamp: Date = new Date()) {
    const formattedDate = format(utcToZonedTime(timestamp, this.timezone), 'yyyy-MM-dd HH:mm:ss');
    this.log(`[${formattedDate}] Delivered: ${JSON.stringify(message)}`);
  }

  // ... rest of the file remains the same ...

  /**
   * Iterates over the incoming messages, pushing them into the queue, logging with timestamps,
   * calling `pushQueue` when necessary, and handling edge cases for the last batch of messages.
   */
  async* iterator() {
    for await (const msg of this.messages) {
      // ... rest of the loop remains the same ...

      this.logWithTimestamp(msg);
      yield* this.pushQueue();
    }

    // ... rest of the last batch handling remains the same ...
  }
}
