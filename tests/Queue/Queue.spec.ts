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
});
