import Edge, { EdgeWeight } from './Edge';
import Vertex from './Vertex';

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
        this.removeEdge(vertex.id, currentVertexId);
        this.removeEdge(currentVertexId, vertex.id);
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

  // remove an edge from all adjacency lists entirely
  private _deleteEdge(fromId: number, toId: number): void {
    const fromVertex = this.getVertex(fromId);
    const toVertex = this.getVertex(toId);
    fromVertex!.edges.delete(toId);
    toVertex!.edges.delete(fromId);
  }
}
