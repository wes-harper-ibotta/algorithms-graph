export default class FlexHeap<T> {
  items: (T | null)[] = [null];
  comparator: (oldEl: T, newEl: T) => boolean;

  // using a comparator to allow the implementer to choose their own heap type
  // comparator also allows for comparing complex objects
  constructor(comparator: (oldEl: T, newEl: T) => boolean) {
    this.comparator = comparator;
  }

  get size(): number {
    // the null value at the beginning of the array should be considered immutable
    // this hides the implementation details from the user and allows for easy checking
    return this.items.length - 1;
  }

  insert(val: T): void {
    this.items.push(val);
    let currentIndex = this.size;

    while (true) {
      const parentIndex = Math.floor(currentIndex / 2);
      if (parentIndex < 1) {
        break;
      }
      if (
        this.comparator(this.items[parentIndex]!, this.items[currentIndex]!)
      ) {
        [this.items[parentIndex], this.items[currentIndex]] = [
          this.items[currentIndex],
          this.items[parentIndex]
        ];
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  extract(): T | null {
    if (this.size < 1) {
      return null;
    }

    let currentIndex = 1;
    // swap removal value and last value
    [this.items[this.size], this.items[currentIndex]] = [
      this.items[currentIndex],
      this.items[this.size]
    ];
    const resultVal = this.items.pop()!;
    while (true) {
      const firstChildIndex = currentIndex * 2;
      const secondChildIndex = firstChildIndex + 1;

      if (firstChildIndex > this.size) {
        break;
      }

      let higherPriorityIndex: number;
      if (secondChildIndex <= this.size) {
        higherPriorityIndex = this.comparator(
          this.items[firstChildIndex]!,
          this.items[secondChildIndex]!
        )
          ? secondChildIndex
          : firstChildIndex;
      } else {
        higherPriorityIndex = firstChildIndex;
      }

      if (
        this.comparator(
          this.items[currentIndex]!,
          this.items[higherPriorityIndex]!
        )
      ) {
        [this.items[higherPriorityIndex], this.items[currentIndex]] = [
          this.items[currentIndex],
          this.items[higherPriorityIndex]
        ];
        currentIndex = higherPriorityIndex;
      } else {
        break;
      }
    }
    return resultVal;
  }
}
