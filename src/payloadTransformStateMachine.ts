import { EventEmitter } from './eventEmitter.js';

export type PayloadTransformState =
  | 'idle'
  | 'transforming'
  | 'validating'
  | 'completed'
  | 'failed';

export interface PayloadTransformEventMap {
  stateChange: { from: PayloadTransformState; to: PayloadTransformState };
  transformStart: { payload: unknown };
  transformEnd: { transformed: unknown };
  validateStart: { payload: unknown };
  validateEnd: { valid: boolean };
  error: { error: Error };
  complete: { result: unknown };
}

export class PayloadTransformStateMachine {
  private _state: PayloadTransformState = 'idle';
  private emitter = new EventEmitter<PayloadTransformEventMap>();
  private transformFn: (payload: unknown) => unknown;
  private validateFn: (payload: unknown) => boolean;

  constructor(
    transformFn: (payload: unknown) => unknown,
    validateFn: (payload: unknown) => boolean,
  ) {
    this.transformFn = transformFn;
    this.validateFn = validateFn;
  }

  get state(): PayloadTransformState {
    return this._state;
  }

  on<K extends keyof PayloadTransformEventMap>(
    event: K,
    handler: (data: PayloadTransformEventMap[K]) => void,
  ): void {
    this.emitter.on(event, handler);
  }

  off<K extends keyof PayloadTransformEventMap>(
    event: K,
    handler: (data: PayloadTransformEventMap[K]) => void,
  ): void {
    this.emitter.off(event, handler);
  }

  execute(payload: unknown): void {
    if (this._state !== 'idle') {
      throw new Error('State machine is not in idle state');
    }
    this.transitionTo('transforming');
    this.emitter.emit('transformStart', { payload });

    let transformed: unknown;
    try {
      transformed = this.transformFn(payload);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.emitter.emit('error', { error });
      this.transitionTo('failed');
      return;
    }

    this.emitter.emit('transformEnd', { transformed });
    this.transitionTo('validating');
    this.emitter.emit('validateStart', { payload: transformed });

    let valid: boolean;
    try {
      valid = this.validateFn(transformed);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.emitter.emit('error', { error });
      this.transitionTo('failed');
      return;
    }

    this.emitter.emit('validateEnd', { valid });
    if (!valid) {
      const error = new Error('Transformed payload failed validation');
      this.emitter.emit('error', { error });
      this.transitionTo('failed');
      return;
    }

    this.emitter.emit('complete', { result: transformed });
    this.transitionTo('completed');
  }

  reset(): void {
    this._state = 'idle';
  }

  private transitionTo(newState: PayloadTransformState): void {
    const from = this._state;
    this._state = newState;
    this.emitter.emit('stateChange', { from, to: newState });
  }
}
