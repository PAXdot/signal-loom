/**
 * SchemaGuardStateMachine handles the state transitions for schema guards.
 */
enum SchemaGuardState {
  /** Initial state, waiting for a valid schema. */
  WAITING_FOR_SCHEMA,

  /** Schema is valid, ready to process events. */
  READY,

  /** Schema is invalid, ready to retry or send to DLQ. */
  ERROR,
}

/**
 * SchemaGuardStateMachine emits events based on schema validation results.
 */
class SchemaGuardStateMachine {
  private state = SchemaGuardState.WAITING_FOR_SCHEMA;
  private lastValidSchema: object | null = null;

  /**
   * Handle schema validation results and emit relevant events.
   * @param schema - The schema that was validated.
   * @param error - The error, if any, from the schema validation.
   */
  public handleSchemaResult(schema: object | null, error: Error | null): void {
    if (error) {
      this.state = SchemaGuardState.ERROR;
      this.lastValidSchema = null;
      // Emit error event (e.g., 'schema-guard-error')
    } else if (schema !== this.lastValidSchema) {
      this.state = SchemaGuardState.READY;
      this.lastValidSchema = schema;
      // Emit ready event (e.g., 'schema-guard-ready')
    }
  }

  /**
   * Check if the state machine is ready to process events.
   * @returns True if ready, false otherwise.
   */
  public isReady(): boolean {
    return this.state === SchemaGuardState.READY;
  }
}
