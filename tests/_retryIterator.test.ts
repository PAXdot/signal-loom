import { describe, it, expect } from 'node:test';
import assert from 'node:assert';
import { retryIterator } from './../src/___retryIterator';

describe('retryIterator', () => {
  it('should succeed on first attempt', async () => {
    const task = () => Promise.resolve('success');
    const deadLetterQueue = (error, attempt) => {};
    const retryPolicy = { maxAttempts: 3, backoffFactor: 1 };
    const iterator = retryIterator(task, deadLetterQueue, retryPolicy);

    const result = await iterator.next();
    assert.equal(result.value.value, 'success');
  });

  it('should retry on failure with exponential backoff', async () => {
    let attempt = 0;
    const task = () => {
      attempt++;
      if (attempt <= 3) {
        return Promise.reject(new Error('Failed attempt'));
      }
      return Promise.resolve('success');
    };
    const deadLetterQueue = (error, attempt) => {};
    const retryPolicy = { maxAttempts: 5, backoffFactor: 1 };
    const iterator = retryIterator(task, deadLetterQueue, retryPolicy);

    let result = await iterator.next();
    assert.equal(result.error.message, 'Failed attempt');

    result = await iterator.next();
    assert.equal(result.value, undefined);

    result = await iterator.next();
    assert.equal(result.error.message, 'Failed attempt');

    result = await iterator.next();
    assert.equal(result.value, undefined);

    result = await iterator.next();
    assert.equal(result.value.value, 'success');
  });

  it('should throw error after max attempts', async () => {
    let attempt = 0;
    const task = () => {
      attempt++;
      return Promise.reject(new Error('Failed attempt'));
    };
    const deadLetterQueue = (error, attempt) => {};
    const retryPolicy = { maxAttempts: 3, backoffFactor: 1 };
    const iterator = retryIterator(task, deadLetterQueue, retryPolicy);

    await iterator.next();
    await iterator.next();
    await iterator.next();

    await expect(iterator.next()).to.be.rejectedWith('Failed after 3 attempts.');
  });
});
