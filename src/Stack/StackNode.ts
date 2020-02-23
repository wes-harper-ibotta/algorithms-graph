export default class StackNode<T> {
  val: T;
  next: StackNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
  }
}
