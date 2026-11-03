import { test, assert, mock } from 'node:test';
import { SchemaGuardStateMachine, SchemaGuardState } from '../src/___schemaGuardStateMachine';

test('SchemaGuardStateMachine initial state is WAITING_FOR_SCHEMA', (t) => {
  const stateMachine = new SchemaGuardStateMachine();
  assert.strictEqual(stateMachine.state, SchemaGuardState.WAITING_FOR_SCHEMA);
});

test('handleSchemaResult transitions to ERROR on schema validation error', (t) => {
  const stateMachine = new SchemaGuardStateMachine();
  stateMachine.handleSchemaResult(null, new Error('Invalid schema'));
  assert.strictEqual(stateMachine.state, SchemaGuardState.ERROR);
  assert.strictEqual(stateMachine.lastValidSchema, null);
});

test('handleSchemaResult transitions to READY on valid schema', (t) => {
  const stateMachine = new SchemaGuardStateMachine();
  const schema = { foo: 'bar' };
  stateMachine.handleSchemaResult(schema, null);
  assert.strictEqual(stateMachine.state, SchemaGuardState.READY);
  assert.deepStrictEqual(stateMachine.lastValidSchema, schema);
});

test('handleSchemaResult does not transition to READY on identical valid schemas', (t) => {
  const stateMachine = new SchemaGuardStateMachine();
  const schema = { foo: 'bar' };
  stateMachine.handleSchemaResult(schema, null);
  stateMachine.handleSchemaResult(schema, null);
  assert.strictEqual(stateMachine.state, SchemaGuardState.READY);
  assert.deepStrictEqual(stateMachine.lastValidSchema, schema);
});

test('isReady returns true after a valid schema', (t) => {
  const stateMachine = new SchemaGuardStateMachine();
  const schema = { foo: 'bar' };
  stateMachine.handleSchemaResult(schema, null);
  assert.ok(stateMachine.isReady());
});

test('isReady returns false after an invalid schema', (t) => {
  const stateMachine = new SchemaGuardStateMachine();
  stateMachine.handleSchemaResult(null, new Error('Invalid schema'));
  assert.notOk(stateMachine.isReady());
});
