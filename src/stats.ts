/**
 * A module for calculating and tracking statistics.
 */
import { Event } from './serialization';

/**
 * A class for tracking and calculating statistics.
 */
export class Stats {
  private totalEvents: number;
  private failedEventsDueToFilter: number;
  private failedEventsDueToOther: number;

  constructor() {
    this.totalEvents = 0;
    this.failedEventsDueToFilter = 0;
    this.failedEventsDueToOther = 0;
  }

  /**
   * Increment total events and track failed events based on the filter result.
   * @param event - The event to track.
   * @param shouldDiscard - Whether the event should be discarded due to filter rules.
   */
  track(event: Event, shouldDiscard: boolean, reason?: string) {
    this.totalEvents++;
    if (shouldDiscard) {
      this.failedEventsDueToFilter++;
    } else if (event === null) {
      this.failedEventsDueToOther++;
    }
  }

  /**
   * Get the total number of events processed.
   */
  getTotalEvents(): number {
    return this.totalEvents;
  }

  /**
   * Get the number of failed events due to filter rules.
   */
  getFailedEventsDueToFilter(): number {
    return this.failedEventsDueToFilter;
  }

  /**
   * Get the number of failed events due to other reasons.
   */
  getFailedEventsDueToOther(): number {
    return this.failedEventsDueToOther;
  }

  /**
   * Reset the statistics.
   */
  reset() {
    this.totalEvents = 0;
    this.failedEventsDueToFilter = 0;
    this.failedEventsDueToOther = 0;
  }
}
