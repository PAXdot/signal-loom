/** Parse and validate filtering rules. */
export type FilterRule = Record<string, string | boolean | number>;

/** Parse raw rule string into FilterRule object. */
export function parseFilterRule(ruleString: string): FilterRule {
  if (typeof ruleString !== 'string' || !ruleString.trim()) {
    throw new Error('Invalid filter rule string');
  }

  const regex = /^(\w+):(\S+)(\s*,\s*(\w+):(\S+))?$/;
  const match = ruleString.match(regex);

  if (!match) {
    throw new Error(`Invalid filter rule syntax: ${ruleString}`);
  }

  const [, key, value, , key2, value2] = match;
  const parsedRule: FilterRule = { [key]: value };

  if (key2) {
    parsedRule[key2] = value2;
  }

  return parsedRule;
}
