import { isSignatureValid, SignatureVerificationResult } from './isSignatureValid';

/**
 * SignatureVerificationStats tracks the statistics of signature verification.
 */
export class SignatureVerificationStats {
  private _countTotal: number = 0;
  private _countValid: number = 0;
  private _countInvalid: number = 0;

  /**
   * Update the statistics with the result of the signature verification.
   * @param result - The result of the signature verification.
   */
  public update(result: SignatureVerificationResult): void {
    this._countTotal += 1;

    if (Object.values(SignatureVerificationResult).includes(result)) {
      switch (result) {
        case SignatureVerificationResult.Valid:
          this._countValid += 1;
          break;
        case SignatureVerificationResult.Invalid:
          this._countInvalid += 1;
          break;
      }
    } else {
      throw new Error(`Unknown signature verification result: ${result}`);
    }
  }

  // ... rest of the class remains the same
}
