import Edge, { EdgeWeight } from './Edge';
import Vertex from './Vertex';
import Stack from '@/Stack/Stack';
import Queue from '@/Queue/Queue';
import FlexHeap from '@/FlexHeap/FlexHeap';

// combine vertex with path information for use in pathfinding algorithms
// include EdgeWeight as an optional third value for best path algorithms
type VertexWithPath<T> = [Vertex<T>, number[], EdgeWeight?];

export default class Graph<T> {
  // must set directed property at instantiation
  readonly directed: boolean;
  head: Vertex<T> | null;
  vertices: Map<number, Vertex<T>>;
  private _currentId: number = 0;

  constructor(directed: boolean = true) {
    this.vertices = new Map<number, Vertex<T>>();
    this.directed = directed;
    this.head = null;
  }

  addVertex(val: T): void {
    const vertex = new Vertex<T>(this._currentId++, val);
    this.vertices.set(vertex.id, vertex);
  }

  removeVertex(id: number): Vertex<T> | undefined {
    const vertex = this.getVertex(id);
    if (!vertex) {
      return undefined;
    }
    this.vertices.delete(vertex.id);
    vertex.edges.forEach(
      (
        _: Edge,
        currentVertexId: number,
        removedVertexEdges: Map<number, Edge>
      ) => {
        // remove the edge from all other vertices' adjacency lists in both directions
        this._deleteEdge(vertex.id, currentVertexId);
      }
    );
    return vertex;
  }

  // add or overwrite edge between two vertices
  addEdge(fromId: number, toId: number, weight?: number): void {
    // provide a default weight of 1 if user does not provide a weight
    weight = weight || 1;
    const fromVertex = this.getVertex(fromId);
    const toVertex = this.getVertex(toId);
    this._passOrThrowVertexException(fromVertex, toVertex);
    // provide both `to` and `from` weights if graph is directed
    // otherwise, leave unset weight `null`
    const toEdge = this.directed ? new Edge(weight) : new Edge(weight, weight);
    const fromEdge = this.directed
      ? new Edge(null, weight)
      : new Edge(weight, weight);

    // set edge in both adjacency maps for faster lookup and vertex removal
    fromVertex!.edges.set(toId, toEdge);
    toVertex!.edges.set(fromId, fromEdge);
  }

  // this removes an edge in one direction if directed
  // setEdge will remove the edge entirely if necessary
  // for deletion from the map, reference _deleteEdge()
  removeEdge(fromId: number, toId: number): void {
    const fromEdge = this.getEdge(fromId, toId);
    const toEdge = this.getEdge(toId, fromId);
    if (!fromEdge || !toEdge) {
      throw new Error('EdgeError: edge does not exist');
    }
    this.setEdge(fromId, toId, null);
    // remove edges in both directions if graph is not directed
    if (!this.directed) {
      this.setEdge(toId, fromId, null);
    }
  }

  getVertex(id: number): Vertex<T> | undefined {
    return this.vertices.get(id);
  }

  setVertex(id: number, val: T): void {
    const vertex = this.getVertex(id);
    this._passOrThrowVertexException(vertex);
    vertex!.val = val;
  }

  // returns entire edge for one vertex including both to and from weights
  getEdge(fromId: number, toId: number): Edge | undefined {
    const fromVertex = this.getVertex(fromId);
    const toVertex = this.getVertex(toId);
    this._passOrThrowVertexException(fromVertex, toVertex);
    return fromVertex!.edges.get(toId);
  }

  // set edge to desired weight
  // handles both directed and undirected edges
  // will delete an edge from the adjacency list entirely if both directions become null
  setEdge(fromId: number, toId: number, weight: EdgeWeight): void {
    const fromEdge = this.getEdge(fromId, toId);
    const toEdge = this.getEdge(toId, fromId);
    if (!fromEdge || !toEdge) {
      throw new Error('EdgeError: edge does not exist');
    }
    fromEdge.to = weight;
    toEdge.from = weight;
    if (this.directed) {
      fromEdge.from = weight;
      toEdge.to = weight;
    }
    if (fromEdge.nullified() && toEdge.nullified()) {
      this._deleteEdge(fromId, toId);
    }
  }

  // return any valid path between start and end vertices without cycles or [] if there are none
  isReachable(startingVertexId: number, endingVertexId: number): number[] {
    const startVertex = this.getVertex(startingVertexId);
    const endVertex = this.getVertex(endingVertexId);
    this._passOrThrowVertexException(startVertex, endVertex);
    // this marks vertices as "visited"
    const visitedVertices = new Set<Vertex<T>>();
    // this will keep track of our vertices in a DFS manner as we go
    const pathStack = new Stack<VertexWithPath<T>>();

    pathStack.push([startVertex!, [startVertex!.id]]);
    while (pathStack.head) {
      // get vertex off the top of the stack (furthest along in the path DFS)
      const stackNode = pathStack.pop()!;
      const currentVertex = stackNode[0];
      const currentPath = stackNode[1];

      visitedVertices.add(currentVertex);
      // if the current vertex is our destination vertex, break the loop
      if (currentVertex.id === endingVertexId) {
        return currentPath;
      }
      currentVertex.edges.forEach((edge: Edge, vertexId: number) => {
        const vertex = this.getVertex(vertexId)!;
        // add each vertex to the stack if it hasn't already been visited
        if (edge.to !== null && !visitedVertices.has(vertex)) {
          pathStack.push([vertex, [...currentPath, vertex.id]]);
        }
      });
    }
    return [];
  }

  // return all paths between a start vertex and end vertex or [] if there are none
  allPaths(startingVertexId: number, endingVertexId: number): number[][] {
    const startVertex = this.getVertex(startingVertexId);
    const endVertex = this.getVertex(endingVertexId);
    this._passOrThrowVertexException(startVertex, endVertex);
    // store all valid paths
    const result: number[][] = [];
    // this marks vertices as "visited"
    const visitedVertices = new Set<Vertex<T>>();
    // this will keep track of our vertices in a DFS manner as we go
    const pathStack = new Stack<VertexWithPath<T>>();

    pathStack.push([startVertex!, [startVertex!.id]]);
    while (pathStack.head) {
      // get vertex off the top of the stack (furthest along in the path DFS)
      const stackNode = pathStack.pop()!;
      const currentVertex = stackNode[0];
      const currentPath = stackNode[1];

      visitedVertices.add(currentVertex);
      // if the current vertex is our destination vertex, add path to list of result paths
      if (currentVertex.id === endingVertexId) {
        result.push(currentPath);
      }
      currentVertex.edges.forEach((edge: Edge, vertexId: number) => {
        const vertex = this.getVertex(vertexId)!;
        // add each vertex to the stack if it hasn't already been visited
        if (edge.to !== null && !visitedVertices.has(vertex)) {
          pathStack.push([vertex, [...currentPath, vertex.id]]);
        }
      });
    }
    return result;
  }

  // return a path representing the fewest possible "turns"
  // essentially the shortest path ignoring edge weight
  // returns an array of vertex IDs
  shortestPath(startingVertexId: number, endingVertexId: number): number[] {
    const startVertex = this.getVertex(startingVertexId);
    const endVertex = this.getVertex(endingVertexId);
    this._passOrThrowVertexException(startVertex, endVertex);

    const visitedVertices = new Set<number>();
    const pathQueue = new Queue<VertexWithPath<T>>();

    pathQueue.enqueue([startVertex!, [startVertex!.id]]);

    while (pathQueue.head) {
      const queueNode = pathQueue.dequeue()!;
      const currentVertex = queueNode[0];
      const currentPath = queueNode[1];

      if (currentVertex.id === endingVertexId) {
        return currentPath;
      }

      visitedVertices.add(currentVertex.id);
      currentVertex.edges.forEach((edge: Edge, vertexId: number): void => {
        if (edge.to !== null && !visitedVertices.has(vertexId)) {
          const vertex = this.getVertex(vertexId)!;
          pathQueue.enqueue([vertex, [...currentPath, vertex.id]]);
        }
      });
    }
    return [];
  }

  // return a path representing the fastest possible route between vertices
  // this accounts for edge weight
  // returns an array of vertex IDs
  // by using a comparator, this method can also be used as an a* implementation of Best First Search
  // this also allows the implementer to choose whether a higher or lower edge weight should be considered "best"
  quickestPath(
    startingVertexId: number,
    endingVertexId: number,
    comparator?: (
      visited: VertexWithPath<T>,
      current: VertexWithPath<T>
    ) => boolean
  ): number[] {
    const startVertex = this.getVertex(startingVertexId);
    const endVertex = this.getVertex(endingVertexId);
    this._passOrThrowVertexException(startVertex, endVertex);

    // prioritize smallest edge weight by default
    comparator =
      comparator ||
      ((visited: VertexWithPath<T>, current: VertexWithPath<T>): boolean =>
        visited[2]! > current[2]!);

    const visitedVertices = new Set<number>();
    // use a priority queue to choose the next best path
    const pathQueue = new FlexHeap<VertexWithPath<T>>(comparator);
    pathQueue.insert([startVertex!, [startVertex!.id], 0]);
    while (pathQueue.size > 0) {
      const vertexWithPath = pathQueue.extract()!;
      const currentVertex = vertexWithPath[0];
      const currentPath = vertexWithPath[1];
      const currentEdgeWeight = vertexWithPath[2]!;

      if (currentVertex.id === endingVertexId) {
        return currentPath;
      }

      visitedVertices.add(currentVertex.id);

      currentVertex.edges.forEach((edge: Edge, vertexId: number): void => {
        if (edge.to !== null && !visitedVertices.has(vertexId)) {
          const vertex = this.getVertex(vertexId)!;
          pathQueue.insert([
            vertex,
            [...currentPath, vertex.id, currentEdgeWeight + edge.to]
          ]);
        }
      });
    }
    return [];
  }

  // remove an edge from all adjacency lists entirely
  private _deleteEdge(fromId: number, toId: number): void {
    const fromVertex = this.getVertex(fromId);
    const toVertex = this.getVertex(toId);
    fromVertex!.edges.delete(toId);
    toVertex!.edges.delete(fromId);
  }

  private _passOrThrowVertexException(
    ...vertices: (Vertex<T> | undefined)[]
  ): void | never {
    vertices.forEach((vertex: Vertex<T> | undefined): void | never => {
      if (!vertex) {
        throw new Error('VertexError: vertex does not exist');
      }
    });
  }
}
