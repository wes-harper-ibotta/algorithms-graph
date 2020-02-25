import { QueueNode } from './';

export default class Queue<T> {
  head: QueueNode<T> | null = null;
  tail: QueueNode<T> | null = null;

  enqueue(val: T): void {
    const node = new QueueNode<T>(val);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }
  }

  dequeue(): T | null {
    if (!this.head) {
      return null;
    }
    const val = this.head.val;
    this.head = this.head.next;

    // set tail to null if we've removed the last value
    if (!this.head) {
      this.tail = null;
    }
    return val;
  }
}
