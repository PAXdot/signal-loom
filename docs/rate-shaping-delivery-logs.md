# Inside src/index.ts
import { rateShaper } from './rateShaper.js';
import { logDelivery } from './rateShapingDeliveryLogs.js';

export function handleEvent(event: unknown) {
  const key = event.type;
  const decision = rateShaper.tryConsume(key);
  logDelivery(key, decision);
  if (decision === 'dropped') return;
  // continue processing
}
