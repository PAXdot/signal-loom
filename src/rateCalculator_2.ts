/**
 * Calculates the rate or throughput of events based on a given time window.
 */
export class RateCalculator {
  private readonly windowMs: number;
  private readonly eventsCount = new Map<string, number>();
  private readonly eventsTimestamp = new Map<string, number>();

  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }

  /**
   * Updates the count and timestamp of events for a given topic.
   * @param topic - The topic of the event.
   * @param timestamp - The timestamp of the event in milliseconds.
   */
  public update(topic: string, timestamp: number): void {
    const now = Date.now();

    if (now - this.windowMs > this.eventsTimestamp.get(topic) || !this.eventsTimestamp.has(topic)) {
      this.eventsCount.set(topic, 1);
      this.eventsTimestamp.set(topic, timestamp);
    } else {
      this.eventsCount.set(topic, (this.eventsCount.get(topic) || 0) + 1);
    }
  }

  /**
   * Calculates the rate of events per second for a given topic.
   * @param topic - The topic of the event.
   * @returns The rate of events per second.
   */
  public calculateRate(topic: string): number {
    const count = this.eventsCount.get(topic) || 0;
    const timestamp = this.eventsTimestamp.get(topic) || 0;
    const elapsedSec = (Date.now() - timestamp) / 1000;

    return count / elapsedSec;
  }
}
