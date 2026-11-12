import { Event, SchemaGuardConfig } from './schemaGuard';
import { SchemaGuardCache } from './schemaGuardCache';

export type SchemaGuardState =
  | { type: 'IDLE' }
  | { type: 'LOADING', config: SchemaGuardConfig }
  | { type: 'READY', cache: SchemaGuardCache }
  | { type: 'ERROR', error: Error };

export type SchemaGuardAction
  | { type: 'LOAD_CONFIG', config: SchemaGuardConfig }
  | { type: 'CAUGHT_ERROR', error: Error }
  | { type: 'INIT', isReplay?: boolean }
  | { type: 'RESET' };

export function schemaGuardStateMachine(
  initialState: SchemaGuardState = { type: 'IDLE' },
): (action: SchemaGuardAction) => SchemaGuardState {
  return (action) => {
    switch (action.type) {
      case 'LOAD_CONFIG':
        return { type: 'LOADING', config: action.config };
      case 'CAUGHT_ERROR':
        return { type: 'ERROR', error: action.error };
      case 'INIT':
        if (initialState.type === 'IDLE' && !action.isReplay) {
          return { type: 'READY', cache: {} };
        }
        return initialState;
      case 'RESET':
        return { type: 'IDLE' };
      default:
        return initialState;
    }
  };
}
