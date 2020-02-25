import { Graph } from '../../src/Graph';

describe('`Graph`', () => {
  describe('`addVertex()`', () => {
    describe('when vertex ID does not exist', () => {
      test("adds the vertex to the graph's list of vertices", () => {
        const graph = new Graph<string, string>();
      });
    });
  });
});
