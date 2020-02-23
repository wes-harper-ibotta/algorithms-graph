export default class QueueNode<T> {
  val: T;
  next: QueueNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}
