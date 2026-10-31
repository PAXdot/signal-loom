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

    switch (result) {
      case SignatureVerificationResult.Valid:
        this._countValid += 1;
        break;
      case SignatureVerificationResult.Invalid:
        this._countInvalid += 1;
        break;
    }
  }

  /**
   * Get the total number of signature verifications performed.
   */
  public get countTotal(): number {
    return this._countTotal;
  }

  /**
   * Get the number of valid signatures.
   */
  public get countValid(): number {
    return this._countValid;
  }

  /**
   * Get the number of invalid signatures.
   */
  public get countInvalid(): number {
    return this._countInvalid;
  }

  /**
   * Reset the statistics to initial state.
   */
  public reset(): void {
    this._countTotal = 0;
    this._countValid = 0;
    this._countInvalid = 0;
  }
}
