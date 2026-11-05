/** Parse and validate filtering rules including regular expressions. */
export type FilterRule = Record<string, string | boolean | number | RegExp>;

/** Parse raw rule string into FilterRule object, supporting regex patterns. */
export function parseFilterRule(ruleString: string): FilterRule {
  if (typeof ruleString !== 'string' || !ruleString.trim()) {
    throw new Error('Invalid filter rule string');
  }

  const regex = /^(\w+):(\S+(\.\/[gimuy]))?(\s*,\s*(\w+):(\S+(\.\/[gimuy]))?)?$/;
  const match = ruleString.match(regex);

  if (!match) {
    throw new Error(`Invalid filter rule syntax: ${ruleString}`);
  }

  const [, key, value, flags, key2, value2, flags2] = match;
  const parsedRule: FilterRule = { [key]: flags ? new RegExp(value, flags) : value };

  if (key2) {
    parsedRule[key2] = flags2 ? new RegExp(value2, flags2) : value2;
  }

  return parsedRule;
}

/** Check if an event matches the given filter rules. */
import { FilterRule } from './filterRule';
export function isFilterMatch(event: Record<string, unknown>, rules: FilterRule[]): boolean {
  return rules.every((rule) => {
    for (const [key, value] of Object.entries(rule)) {
      if (typeof value === 'regexp') {
        if (!value.test(event[key])) {
          return false;
        }
      } else if (event[key] !== value) {
        return false;
      }
    }
    return true;
  });
}
