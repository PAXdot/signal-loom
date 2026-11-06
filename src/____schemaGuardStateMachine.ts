import { Event, SchemaGuardConfig } from './schemaGuard';
import { SchemaGuardCache } from './schemaGuardCache';

export type SchemaGuardState =
  | { type: 'IDLE' }
  | { type: 'LOADING', config: SchemaGuardConfig }
  | { type: 'READY', cache: SchemaGuardCache }
  | { type: 'ERROR', error: Error };

export type SchemaGuardAction =
  | { type: 'LOAD_CONFIG', config: SchemaGuardConfig }
  | { type: 'CAUGHT_ERROR', error: Error }
  | { type: 'INIT' };

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
        if (initialState.type === 'IDLE') {
          return { type: 'READY', cache: {} };
        }
        return initialState;
      default:
        return initialState;
    }
  };
}
