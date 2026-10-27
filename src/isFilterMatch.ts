/**
 * Checks whether a payload matches a filter rule.
 * Supports exact match, regex, and nested paths via dot notation.
 */
export function isFilterMatch(
  rule: { path: string; value?: unknown; regex?: string },
  payload: Record<string, unknown>
): boolean {
  const valueAtPath = getValueAtPath(payload, rule.path);
  if (rule.regex !== undefined) {
    const re = new RegExp(rule.regex);
    return typeof valueAtPath === 'string' && re.test(valueAtPath);
  }
  return valueAtPath === rule.value;
}

function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current !== null && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
