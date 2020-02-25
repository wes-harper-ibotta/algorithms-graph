import { FlexHeap } from '../../src/FlexHeap';

describe('`FlexHeap`', () => {
  // default comparator for a minHeap if all elements are numbers
  function defaultComparator(oldEl: number, newEl: number): boolean {
    return oldEl > newEl;
  }

  // I suppose I could unit test this method also
  // This is a side project for fun so I'm not going to *shrug*
  function isMinHeap(heap: FlexHeap<any>): boolean {
    if (heap.items[0] !== null) {
      return false;
    }
    for (let i = 1; i < heap.size; i++) {
      const firstChildValue = heap.items[i * 2];
      const secondChildValue = heap.items[i * 2 + 1];

      if (firstChildValue === undefined || secondChildValue === undefined) {
        continue;
      }

      if (heap.items[i] > firstChildValue || heap.items[i] > secondChildValue) {
        return false;
      }
    }
    return true;
  }

  describe('`insert()`', () => {
    describe('when the heap is empty', () => {
      test('adds new value to index 1', () => {
        const h = new FlexHeap<number>(defaultComparator);
        h.insert(1);
        expect(h.items[1]).toBe(1);
      });

      test('does not delete the null value at index 0', () => {
        const h = new FlexHeap<number>(defaultComparator);
        h.insert(1);
        expect(h.items[0]).toBe(null);
      });
    });

    describe('when the heap has at least one value', () => {
      let h: FlexHeap<number>;
      beforeEach(() => {
        h = new FlexHeap<number>(defaultComparator);
        h.insert(1);
      });

      describe('new value is highest priority', () => {
        test('value is promoted to the highest priority location', () => {
          h.insert(0);
          expect(h.items[1]).toBe(0);
        });
      });

      describe('new value is lowest priority', () => {
        test('value is not promoted', () => {
          h.insert(2);
          expect(h.items[2]).toBe(2);
        });
      });

      describe('many mixed values are added', () => {
        beforeEach(() => {
          h.insert(3);
          h.insert(2);
          h.insert(0);
          h.insert(1);
          h.insert(0);
          h.insert(5);
          h.insert(3);
          h.insert(4);
        });
        test('a valid heap is maintained', () => {
          expect(isMinHeap(h)).toBe(true);
        });
      });
    });
  });

  describe('`extract()`', () => {
    describe('when heap is empty', () => {
      test('returns `null`', () => {
        const h = new FlexHeap<number>(defaultComparator);
        expect(h.extract()).toBe(null);
      });
    });
  });
});
