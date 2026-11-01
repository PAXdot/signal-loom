import { Event } from './event.js';

export const VERSION = '0.1.0';

export interface WebhookHandler {
  /**
   * Determines if the handler can process the incoming event.
   * @param {string} type - The type of the incoming event.
   * @returns {boolean} - True if the handler can process the event, false otherwise.
   */
  canHandle(type: string): boolean;

  /**
   * Handles the incoming event.
   * @param {Event} event - The incoming event to be handled.
   * @param {() => void} next - Continuation callback if the handler does not process the event.
   */
  handle(event: Event, next: () => void): void;
}

/**
 * The main router function that processes incoming webhooks and event streams.
 * @param {Array<WebhookHandler>} handlers - An array of custom webhook handlers.
 */
export async function router(handlers: WebhookHandler[]): Promise<void> {
  for (const event of [/* stream of incoming events */]) {
    for (const handler of handlers) {
      if (handler.canHandle(event.type)) {
        try {
          handler.handle(event, () => {});
          console.log(`Handled event with signature: ${event.signature}`);
        } catch (error) {
          console.warn(`Failed to handle event with signature "${event.signature}":`, error.message);
        }
        break; // Stop further routing if the event is handled
      }
    }
  }
}

// Example implementation of a custom webhook handler
class MyCustomHandler implements WebhookHandler {
  canHandle(type: string): boolean {
    return type === 'my-custom-event-type';
  }

  handle(event: Event, next: () => void): void {
    console.log(`Handling custom event with signature: ${event.signature}`);
    next();
  }
}
