import { Queue } from '../../src/Queue';

describe('`Queue`', () => {
  describe('`enqueue()`', () => {
    describe('when queue is empty', () => {
      test('new node becomes both `head` and `tail` of queue', () => {
        const q = new Queue<number>();
        q.enqueue(1);
        expect(q.head!.val).toBe(1);
        expect(q.tail!.val).toBe(1);
      });
    });

    describe('when queue has at least one value', () => {
      let q: Queue<number>;
      beforeEach(() => {
        q = new Queue<number>();
        q.enqueue(1);
      });

      test('new node becomes new `tail` of queue', () => {
        q.enqueue(2);
        expect(q.tail!.val).toBe(2);
      });

      test('`head` remains unchanged', () => {
        q.enqueue(2);
        expect(q.head!.val).toBe(1);
      });

      test('queue retains insertion order', () => {
        q.enqueue(2);
        q.enqueue(3);
        q.enqueue(4);

        let currNode = q.head;
        let testNum = 1;
        while (currNode) {
          expect(currNode!.val).toBe(testNum++);
          currNode = currNode.next;
        }
      });
    });
  });

  describe('`dequeue()`', () => {
    describe('when the queue is empty', () => {
      test('returns null', () => {
        const q = new Queue<any>();
        expect(q.dequeue()).toBe(null);
      });
    });

    describe('when the queue has at least one value', () => {
      let q: Queue<number>;
      beforeEach(() => {
        q = new Queue<number>();
        q.enqueue(1);
      });

      test('returns the value of the node that gets removed', () => {
        expect(q.dequeue()).toBe(1);
      });

      test('removes nodes in "FIFO" order', () => {
        q.enqueue(2);
        q.enqueue(3);
        q.enqueue(4);

        let testVal = 1;
        while (q.head) {
          expect(q.dequeue()).toBe(testVal++);
        }
      });

      describe('when the last value is removed', () => {
        test('it sets `head` and `tail` to `null`', () => {
          q.dequeue();
          expect(q.head).toBe(null);
          expect(q.tail).toBe(null);
        });
      });
    });
  });
});
