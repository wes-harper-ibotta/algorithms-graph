import { Stack } from '../../src/Stack';

describe('`Stack`', () => {
  describe('`push()`', () => {
    describe('when queue is empty', () => {
      test('new node becomes `head` of queue', () => {
        const q = new Stack<number>();
        q.push(1);
        expect(q.head!.val).toBe(1);
      });
    });

    describe('when queue has at least one value', () => {
      let q: Stack<number>;
      beforeEach(() => {
        q = new Stack<number>();
        q.push(1);
      });

      test('new node becomes new `head` of queue', () => {
        q.push(2);
        expect(q.head!.val).toBe(2);
      });

      test('queue retains insertion order', () => {
        q.push(2);
        q.push(3);
        q.push(4);

        let currNode = q.head;
        let testNum = 4;
        while (currNode) {
          expect(currNode!.val).toBe(testNum--);
          currNode = currNode.next;
        }
      });
    });
  });

  describe('`pop()`', () => {
    describe('when the queue is empty', () => {
      test('returns null', () => {
        const q = new Stack<any>();
        expect(q.pop()).toBe(null);
      });
    });

    describe('when the queue has at least one value', () => {
      let q: Stack<number>;
      beforeEach(() => {
        q = new Stack<number>();
        q.push(1);
      });

      test('returns the value of the node that gets removed', () => {
        expect(q.pop()).toBe(1);
      });

      test('removes nodes in "LIFO" order', () => {
        q.push(2);
        q.push(3);
        q.push(4);

        let testVal = 4;
        while (q.head) {
          expect(q.pop()).toBe(testVal--);
        }
      });

      describe('when the last value is removed', () => {
        test('it sets `head` to `null`', () => {
          q.pop();
          expect(q.head).toBe(null);
        });
      });
    });
  });
});
