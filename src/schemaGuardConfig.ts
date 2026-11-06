/**
 * Schema guard configuration loader
 */
import { readFileSync } from 'node:fs';
import { parse } from 'node:jsonc-parser';

type SchemaGuardConfig = {
  cacheSize: number;
  expireTime: number;
  schemaDir: string;
};

const SCHEMA_GUARD_CONFIG_FILE = 'schemaGuardConfig.jsonc';

export function loadSchemaGuardConfig(): SchemaGuardConfig {
  const configFilePath = new URL('../', import.meta.url).pathname + SCHEMA_GUARD_CONFIG_FILE;
  const configContent = readFileSync(configFilePath, 'utf-8');
  return parse(configContent) as SchemaGuardConfig;
}
