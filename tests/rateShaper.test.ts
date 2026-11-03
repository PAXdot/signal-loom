import { assert } from 'node:assert';
import { RateShaper } from '../src/rateShaper.js';

describe('RateShaper', () => {
  const log = ( msg ) => console.log(`LOG: ${msg}`);

  it('delivers messages at the specified rate', async () => {
    const messages = [
      ' Msg1',
      ' Msg2',
      ' Msg3'
    ];
    const shapedMessages = [];
    const MockRateShaper = class extends RateShaper {
      log(message) {
        shapedMessages.push(message);
        super.log(message);
      }
    };

    const rateShaper = new MockRateShaper(messages[Symbol.asyncIterator](), 1, log);
    await new Promise<void>((resolve) => {
      const unsubscribe = rateShaper.once('delivered', resolve);
      rateShaper.start();
    });

    assert.deepEqual(shapedMessages, messages);
  });

  it('emits rateLimited event when message rate exceeds limit', async () => {
    const messages = new Array(20).fill(undefined).map((_, i) => `Msg${i + 1}`);
    let rateLimitedEmitCount = 0;
    const rateShaper = new RateShaper(messages[Symbol.asyncIterator](), 5, log);
    rateShaper.on('rateLimited', () => rateLimitedEmitCount++);

    await new Promise<void>((resolve) => {
      const unsubscribe = rateShaper.once('delivered', resolve);
      rateShaper.start();
    });

    assert.strictEqual(rateLimitedEmitCount, 5);
  });
});
