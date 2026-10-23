/**
 * Validates the signature of an incoming event and provides a human-readable output.
 *
 * @param event - The incoming event to validate.
 * @param expectedSignature - The expected signature for the event.
 * @returns An object containing the validation result and a human-readable message.
 */
function isSignatureValid(event: { signature: string }, expectedSignature: string): { valid: boolean, message: string } {
  if (!event || !event.signature) {
    return { valid: false, message: 'Invalid event: missing signature' };
  }

  if (event.signature !== expectedSignature) {
    return { valid: false, message: `Invalid signature: expected ${expectedSignature}, received ${event.signature}` };
  }

  return { valid: true, message: 'Signature is valid' };
}

export { isSignatureValid };
