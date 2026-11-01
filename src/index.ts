import { Event } from './event.js';

export const VERSION = '0.1.0';

export interface WebhookHandler {
  /**
   * Implement this method to determine if the handler can process the incoming event.
   * @param {string} type - The type of the incoming event.
   * @returns {boolean} - True if the handler can process the event, false otherwise.
   */
  canHandle(type: string): boolean;

  /**
   * Implement this method to handle the incoming event.
   * @param {Event} event - The incoming event to be handled.
   * @param {() => void} next - A callback to continue routing the event if the handler does not process it.
   */
  handle(event: Event, next: () => void): void;
}

/**
 * The main router function that processes incoming webhooks and event streams.
 * @param {Array<WebhookHandler>} handlers - An array of custom webhook handlers.
 */
export async function router(handlers: WebhookHandler[]): Promise<void> {
  // ... routing logic using the provided handlers
}

// Example implementation of a custom webhook handler
class MyCustomHandler implements WebhookHandler {
  canHandle(type: string): boolean {
    // Implement custom logic to determine if this handler can process the event
    return type === 'my-custom-event-type';
  }

  handle(event: Event, next: () => void): void {
    // Implement custom logic to handle the event
    console.log('Handling custom event:', event);
    next(); // Call next to continue routing the event
  }
}
