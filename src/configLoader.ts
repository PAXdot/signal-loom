/**
 * Loads and validates configuration for filtering rules.
 */
export class ConfigLoader {
  /**
   * Loads the filtering rules configuration.
   * @param configObject - The configuration object to load.
   * @returns A validated FilterRule[].
   */
  static loadFilterRules(configObject: any): FilterRule[] {
    if (!Array.isArray(configObject.filterRules)) {
      throw new Error('Configuration missing "filterRules" array');
    }

    return configObject.filterRules.map((ruleConfig: any) => {
      if (!this.isValidFilterRuleConfig(ruleConfig)) {
        throw new Error(`Invalid filter rule configuration: ${JSON.stringify(ruleConfig)}`);
      }

      return new FilterRule(ruleConfig.id, ruleConfig.pattern, ruleConfig.action);
    });
  }

  /**
   * Checks if a configuration object is a valid filter rule.
   * @param configObject - The configuration object to check.
   * @returns True if the object is a valid filter rule configuration, false otherwise.
   */
  private static isValidFilterRuleConfig(configObject: any): boolean {
    return (
      typeof configObject.id === 'string' &&
      typeof configObject.pattern === 'string' &&
      ['allow', 'deny'].includes(configObject.action)
    );
  }
}
