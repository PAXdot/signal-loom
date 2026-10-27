/**
 * A module for calculating and tracking statistics.
 */
import { Event } from './serialization';

/**
 * A class for tracking and calculating statistics.
 */
export class Stats {
  private totalEvents: number;
  private failedEvents: number;

  constructor() {
    this.totalEvents = 0;
    this.failedEvents = 0;
  }

  /**
   * Increment total events and failed events if the event is null.
   * @param event - The event to track.
   */
  track(event: Event | null) {
    this.totalEvents++;
    if (event === null) {
      this.failedEvents++;
    }
  }

  /**
   * Get the total number of events processed.
   */
  getTotalEvents(): number {
    return this.totalEvents;
  }

  /**
   * Get the number of failed events.
   */
  getFailedEvents(): number {
    return this.failedEvents;
  }

  /**
   * Reset the statistics.
   */
  reset() {
    this.totalEvents = 0;
    this.failedEvents = 0;
  }
}
