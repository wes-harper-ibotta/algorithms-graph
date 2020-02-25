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
});
