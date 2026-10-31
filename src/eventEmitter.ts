// src/eventEmitter.ts

type EventTypes = 'transform-success' | 'transform-failure';

interface TransformEventPayload {
  payload: any;
  error?: Error;
}

class EventEmitter {
  private listeners: { [event in EventTypes]: ((payload: TransformEventPayload) => Promise<void>)[] };

  constructor() {
    this.listeners = {
      'transform-success': [],
      'transform-failure': [],
    };
  }

  on(event: EventTypes, listener: (payload: TransformEventPayload) => Promise<void>): void {
    if (this.listeners[event]) {
      this.listeners[event].push(listener);
    } else {
      throw new Error(`Unknown event: ${event}`);
    }
  }

  off(event: EventTypes, listener: (payload: TransformEventPayload) => Promise<void>): void {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(listener);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
      }
    } else {
      throw new Error(`Unknown event: ${event}`);
    }
  }

  async* emit(event: EventTypes, payload: TransformEventPayload): AsyncGenerator<void> {
    if (this.listeners[event]) {
      for (const listener of this.listeners[event]) {
        yield listener(payload);
      }
    }
  }
}

export default EventEmitter;
