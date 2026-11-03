// src/payloadTransformStats.ts

import { EventEmitter } from './eventEmitter';
import { FilterRule } from './filterRule';
import { Transform } from './transform';

export interface PayloadTransformStats {
  totalTransforms: number;
  totalEventsFilteredOutByTransform: number;
  transformRules: Map<string, { matches: number; transforms: number }>;
}

export class PayloadTransformStatsEmitter extends EventEmitter<string, PayloadTransformStats> {}

export function initPayloadTransformStatsEmitter(): PayloadTransformStatsEmitter {
  return new PayloadTransformStatsEmitter('transform');
}

export function updatePayloadTransformStats(
  statsEmitter: PayloadTransformStatsEmitter,
  transformRuleId: string,
  transform: Transform,
  filterRules: FilterRule[],
  payload: any
): PayloadTransformStats {
  const stats = statsEmitter.get();

  stats.totalTransforms++;
  if (!transform_rules.get(transformRuleId)?.matches) {
    transform_rules.set(transformRuleId, { matches: 0, transforms: 0 });
  }
  transform_rules.get(transformRuleId)?.transforms++;

  let filteredOutByTransform = 0;
  filterRules.forEach((rule) => {
    if (transform.matcher(rule, payload)) {
      stats.totalEventsFilteredOutByTransform++;
      filteredOutByTransform++;
    }
  });

  return stats;
}
