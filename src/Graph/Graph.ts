import Edge, { EdgeWeight } from './Edge';
import Vertex from './Vertex';
import Stack from '@/Stack/Stack';

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
    if (!fromVertex || !toVertex) {
      throw new Error('VertexError: vertex does not exist');
    }
    // provide both `to` and `from` weights if graph is directed
    // otherwise, leave unset weight `null`
    const toEdge = this.directed ? new Edge(weight) : new Edge(weight, weight);
    const fromEdge = this.directed
      ? new Edge(null, weight)
      : new Edge(weight, weight);

    // set edge in both adjacency maps for faster lookup and vertex removal
    fromVertex.edges.set(toId, toEdge);
    toVertex.edges.set(fromId, fromEdge);
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
    if (!vertex) {
      throw new Error('VertexError: vertex does not exist');
    }
    vertex.val = val;
  }

  // returns entire edge for one vertex including both to and from weights
  getEdge(fromId: number, toId: number): Edge | undefined {
    const fromVertex = this.getVertex(fromId);
    const toVertex = this.getVertex(toId);
    if (!fromVertex || !toVertex) {
      throw new Error('VertexError: vertex does not exist');
    }
    return fromVertex.edges.get(toId);
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
    if (!startVertex || !endVertex) {
      throw new Error('VertexError: vertex does not exist');
    }
    // this marks vertices as "visited"
    const visitedVertices = new Set<Vertex<T>>();
    // this will keep track of our vertices in a DFS manner as we go
    const pathStack = new Stack<[Vertex<T>, number[]]>();

    visitedVertices.add(startVertex);
    pathStack.push([startVertex, [startVertex.id]]);
    while (pathStack.head) {
      // get vertex off the top of the stack (furthest along in the path DFS)
      const stackNode = pathStack.pop()!;
      const currentVertex = stackNode[0];
      const currentPath = stackNode[1];
      // if the current vertex is our destination vertex, break the loop
      if (currentVertex.id === endingVertexId) {
        return currentPath;
      }
      currentVertex.edges.forEach((_, vertexId: number) => {
        const vertex = this.getVertex(vertexId)!;
        // add each vertex to the stack if it hasn't already been visited
        if (!visitedVertices.has(vertex)) {
          visitedVertices.add(vertex);
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
    if (!startVertex || !endVertex) {
      throw new Error('VertexError: vertex does not exist');
    }
    // store all valid paths
    const result: number[][] = [];
    // this marks vertices as "visited"
    const visitedVertices = new Set<Vertex<T>>();
    // this will keep track of our vertices in a DFS manner as we go
    const pathStack = new Stack<[Vertex<T>, number[]]>();

    visitedVertices.add(startVertex);
    pathStack.push([startVertex, [startVertex.id]]);
    while (pathStack.head) {
      // get vertex off the top of the stack (furthest along in the path DFS)
      const stackNode = pathStack.pop()!;
      const currentVertex = stackNode[0];
      const currentPath = stackNode[1];
      // if the current vertex is our destination vertex, add path to list of result paths
      if (currentVertex.id === endingVertexId) {
        result.push(currentPath);
      }
      currentVertex.edges.forEach((_, vertexId: number) => {
        const vertex = this.getVertex(vertexId)!;
        // add each vertex to the stack if it hasn't already been visited
        if (!visitedVertices.has(vertex)) {
          visitedVertices.add(vertex);
          pathStack.push([vertex, [...currentPath, vertex.id]]);
        }
      });
    }
    return result;
  }

  // return a path representing the fewest possible "turns"
  // essentially the shortest path ignoring edge weight
  // returns an array of vertex IDs
  // shortestPath(startingVertexId: number, endingVertexId: number): number[] {}

  // return a path representing the fastest possible route between vertices
  // this accounts for edge weight
  // returns an array of vertex IDs
  // quickestPath(startingVertexId: number, endingVertexId: number): number[] {}

  // remove an edge from all adjacency lists entirely
  private _deleteEdge(fromId: number, toId: number): void {
    const fromVertex = this.getVertex(fromId);
    const toVertex = this.getVertex(toId);
    fromVertex!.edges.delete(toId);
    toVertex!.edges.delete(fromId);
  }
}
