import { Graph } from '../../src';
import { Vertex } from '../../src/Graph';

describe('`Graph`', () => {
  describe('`addVertex()`', () => {
    describe('when vertex ID does not exist', () => {
      test("adds the vertex to the graph's list of vertices", () => {
        const graph = new Graph<string, string>();
        graph.addVertex('a', 'test');
        expect(graph.vertices.has('a')).toBe(true);
      });

      test("retains the vertex's value", () => {
        const graph = new Graph<string, string>();
        graph.addVertex('a', 'test');
        expect(graph.vertices.get('a')!.val!).toBe('test');
      });
    });

    describe('when vertex ID exists', () => {
      test('throws an error', () => {
        const graph = new Graph<string, string>();
        graph.addVertex('a', 'test');
        expect(() => {
          graph.addVertex('a', 'test');
        }).toThrow(new RegExp('^VertexError:'));
      });
    });
  });

  describe('`removeVertex()`', () => {
    describe('when the vertex does not exist', () => {
      test('returns `undefined`', () => {
        const graph = new Graph<any, any>();
        expect(graph.removeVertex('a')).toBe(undefined);
      });
    });

    describe('when the vertex exists', () => {
      test('returns the entire vertex', () => {
        const graph = new Graph<string, string>();
        graph.addVertex('a', 'test');
        const removedVertex = graph.removeVertex('a');
        expect(removedVertex instanceof Vertex);
        expect(removedVertex!.val).toBe('test');
      });

      test('removes the vertex from the list of vertices', () => {
        const graph = new Graph<string, string>();
        graph.addVertex('a', 'test');
        expect(graph.vertices.has('a')).toBe(true);
        graph.removeVertex('a');
        expect(graph.vertices.has('a')).toBe(false);
      });
    });

    describe('when the vertex has edges', () => {
      it('removes the relevant edges from the graph', () => {
        const graph = new Graph<string, string>();
        graph.addVertex('a', 'test');
        graph.addVertex('b', 'test2');
        graph.addEdge('a', 'b');
        graph.removeVertex('a');
        expect(graph.getVertex('b')!.edges.has('a')).toBe(false);
      });
    });
  });

  describe('`addEdge()`', () => {
    describe('when any given vertex does not exist', () => {
      test('throws an error', () => {
        const graph = new Graph<string, string>();
        expect(() => {
          graph.addEdge('a', 'b');
        }).toThrow(new RegExp('^VertexError:'));
      });
    });

    describe('when vertices exist', () => {
      describe('when `directed` is `false`', () => {
        test('creates an edge where both `to` and `from` are equal', () => {
          const graph = new Graph<string, string>(false);
          graph.addVertex('a', 'test1');
          graph.addVertex('b', 'test2');
          graph.addEdge('a', 'b', 1);
          expect(graph.getVertex('a')!.edges.get('b')!).toEqual({
            to: 1,
            from: 1
          });
          expect(graph.getVertex('b')!.edges.get('a')!).toEqual({
            to: 1,
            from: 1
          });
        });

        describe('when an edge already exists', () => {
          test('overwrites the edge', () => {
            const graph = new Graph<string, string>(false);
            graph.addVertex('a', 'test1');
            graph.addVertex('b', 'test2');
            graph.addEdge('a', 'b', 1);
            graph.addEdge('a', 'b', 2);

            expect(graph.getVertex('a')!.edges.get('b')!).toEqual({
              to: 2,
              from: 2
            });
            expect(graph.getVertex('b')!.edges.get('a')!).toEqual({
              to: 2,
              from: 2
            });
          });
        });

        describe('when weight is not given', () => {
          test('sets a weight of 1 in both directions', () => {
            const graph = new Graph<string, string>(false);
            graph.addVertex('a', 'test1');
            graph.addVertex('b', 'test2');
            graph.addEdge('a', 'b');
            expect(graph.getVertex('a')!.edges.get('b')!).toEqual({
              to: 1,
              from: 1
            });
            expect(graph.getVertex('b')!.edges.get('a')!).toEqual({
              to: 1,
              from: 1
            });
          });
        });
      });

      describe('when `directed` is `true`', () => {
        test('creates a directional edge on both vertices', () => {
          const graph = new Graph<string, string>();
          graph.addVertex('a', 'test1');
          graph.addVertex('b', 'test2');
          graph.addEdge('a', 'b', 1);
          expect(graph.getVertex('a')!.edges.get('b')!).toEqual({
            to: 1,
            from: null
          });
          expect(graph.getVertex('b')!.edges.get('a')!).toEqual({
            to: null,
            from: 1
          });
        });

        describe('when the edge exists', () => {
          test('overwrites the directional edge on both sides', () => {
            const graph = new Graph<string, string>();
            graph.addVertex('a', 'test1');
            graph.addVertex('b', 'test2');
            graph.addEdge('a', 'b', 1);
            graph.addEdge('b', 'a', 2);
            expect(graph.getVertex('a')!.edges.get('b')!).toEqual({
              to: null,
              from: 2
            });
            expect(graph.getVertex('b')!.edges.get('a')!).toEqual({
              to: 2,
              from: null
            });
          });
        });

        describe('when weight is not given', () => {
          test('sets a weight of 1 in one direction', () => {
            const graph = new Graph<string, string>();
            graph.addVertex('a', 'test1');
            graph.addVertex('b', 'test2');
            graph.addEdge('a', 'b');
            expect(graph.getVertex('a')!.edges.get('b')!).toEqual({
              to: 1,
              from: null
            });
            expect(graph.getVertex('b')!.edges.get('a')!).toEqual({
              to: null,
              from: 1
            });
          });
        });
      });
    });
  });

  describe('`removeEdge()`', () => {
    describe('when any given vertex does not exist', () => {
      test('throws an error', () => {
        const graph = new Graph<any, any>();
        expect(() => {
          graph.removeEdge('a', 'b');
        }).toThrow(new RegExp('^VertexError:'));
      });
    });

    describe('when edge exists', () => {
      describe('when graph is `directed`', () => {
        test('removes the edge entirely in both directions', () => {
          const graph = new Graph<any, any>();
          graph.addVertex('a', 'test1');
          graph.addVertex('b', 'test2');
          graph.addEdge('a', 'b', 2);
          expect(graph.getEdge('a', 'b')).toBeTruthy();
          graph.removeEdge('a', 'b');
          expect(graph.getEdge('a', 'b')).toBeUndefined();
        });
      });
    });
  });
});
