import { strict as assert } from 'node:assert';

/**
 * A priority queue for retry/dead-letter entries, ordered by retry time (ascending).
 * Supports O(log n) push and pop operations.
 */
export class RetryDlqPriorityQueue<T> {
  private readonly heap: T[] = [];
  private readonly compare: (a: T, b: T) => number;

  /**
   * @param comparator - A function returning negative if a < b (higher priority).
   *                     Defaults to ascending numeric order if T is number.
   */
  constructor(comparator?: (a: T, b: T) => number) {
    this.compare = comparator ?? ((a: T, b: T) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }
      throw new TypeError('Default comparator requires numeric entries');
    });
  }

  /** Number of entries in the queue. */
  get size(): number {
    return this.heap.length;
  }

  /** Push an entry into the queue. */
  push(entry: T): void {
    this.heap.push(entry);
    this.siftUp(this.heap.length - 1);
  }

  /** Pop and return the entry with highest priority (lowest compare value). Returns undefined if empty. */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  /** Return the highest priority entry without removing it. Returns undefined if empty. */
  peek(): T | undefined {
    return this.heap[0];
  }

  /** Check if the queue is empty. */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.compare(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  private siftDown(index: number): void {
    const size = this.heap.length;
    while (true) {
      let smallest = index;
      const left = (index << 1) + 1;
      const right = left + 1;
      if (left < size && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < size && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

// Unit tests (run with node --test src/retryDlqPriorityQueue.ts)
// To test standalone, uncomment below:
// import { test } from 'node:test';
// import assert from 'node:assert';
// test('priority queue numeric', () => {
//   const q = new RetryDlqPriorityQueue<number>();
//   assert.ok(q.isEmpty());
//   q.push(3);
//   q.push(1);
//   q.push(2);
//   assert.equal(q.size, 3);
//   assert.equal(q.peek(), 1);
//   assert.equal(q.pop(), 1);
//   assert.equal(q.pop(), 2);
//   assert.equal(q.pop(), 3);
//   assert.ok(q.isEmpty());
// });
