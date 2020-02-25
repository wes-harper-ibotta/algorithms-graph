import Edge from './Edge';

export type VertexID = number | string;

export default class Vertex<T> {
  id: VertexID;
  val: T;
  edges: Map<VertexID, Edge>;

  constructor(id: VertexID, val: T) {
    this.id = id;
    this.val = val;
    this.edges = new Map<VertexID, Edge>();
  }
  // is vertex object adjacent to given vertex ID?
  adjacent(id: VertexID): boolean {
    return !!this.edges.get(id);
  }
}
