import { describe, it, expect } from 'node:test';
import { assert } from 'node:assert';
import { FilterStateMachine, FilterState } from './filterStateMachine';
import { FilterRule, FilterOperation } from './filterRule';

describe('FilterStateMachine', () => {
  it('should start in idle state', () => {
    const machine = new FilterStateMachine();
    expect(machine.state).toBe(FilterState.IDLE);
  });

  it('should transition to active when active rule is added', () => {
    const machine = new FilterStateMachine();
    const rule: FilterRule = { operation: FilterOperation.ACTIVE, value: '' };
    machine.setFilterRule(rule);
    expect(machine.state).toBe(FilterState.ACTIVE);
  });

  it('should transition to idle when inactive rule is added', () => {
    const machine = new FilterStateMachine();
    machine.setFilterRule({ operation: FilterOperation.ACTIVE, value: '' });
    machine.setFilterRule({ operation: FilterOperation.INACTIVE, value: '' });
    expect(machine.state).toBe(FilterState.IDLE);
  });

  it('should not accept invalid operations', () => {
    const machine = new FilterStateMachine();
    expect(() => machine.setFilterRule({ operation: 'invalid' as FilterOperation, value: '' })).toThrow();
  });
});
