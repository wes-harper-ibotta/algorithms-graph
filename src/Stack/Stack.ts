import StackNode from './StackNode';

export default class Stack<T> {
  head: StackNode<T> | null;

  constructor() {
    this.head = null;
  }

  push(val: T): void {
    const node = new StackNode<T>(val);
    node.next = this.head;
    this.head = node;
  }

  pop(): T | null {
    if (!this.head) {
      return null;
    }
    const { val } = this.head;
    this.head = this.head.next;
    return val;
  }
}
