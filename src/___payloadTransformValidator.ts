/**
 * Validates payload transforms for correctness before execution.
 * Ensures transforms are properly typed and have valid schemas.
 */
export interface PayloadTransformValidator {
  /**
   * Validates a single transform function against its schema.
   * @param transform - The transform function to validate
   * @param schema - The schema describing the expected input and output
   * @returns Error if validation fails, otherwise undefined
   */
  validateTransform(
    transform: (input: unknown) => unknown,
    schema: {
      input?: unknown;
      output?: unknown;
    }
  ): string | undefined;
}

export class PayloadTransformValidatorImpl implements PayloadTransformValidator {
  validateTransform(transform: (input: unknown) => unknown, schema: {
    input?: unknown,
    output?: unknown
  }): string | undefined {
    // Basic type checking for transform function
    if (typeof transform !== 'function') {
      return 'Transform must be a function';
    }

    // Validate input schema if provided
    if (schema.input !== undefined) {
      const inputTest = this._validateSchema(schema.input, 'input');
      if (inputTest) return inputTest;
    }

    // Validate output schema if provided
    if (schema.output !== undefined) {
      const outputTest = this._validateSchema(schema.output, 'output');
      if (outputTest) return outputTest;
    }

    return undefined;
  }

  private _validateSchema(schema: unknown, type: 'input' | 'output'): string | undefined {
    // Basic structure validation
    if (typeof schema !== 'object' || schema === null) {
      return `${type} schema must be an object`;
    }

    // Check for required properties
    if ('type' in schema) {
      if (typeof schema.type !== 'string') {
        return `${type} schema.type must be a string`;
      }
    }

    // Check for optional properties
    if ('properties' in schema) {
      if (!Array.isArray(schema.properties)) {
        return `${type} schema.properties must be an array`;
      }
    }

    return undefined;
  }
}
