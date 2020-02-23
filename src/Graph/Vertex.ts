import Edge from './Edge';

export default class Vertex<T> {
  id: number;
  val: T;
  edges: Map<number, Edge>;

  constructor(id: number, val: T) {
    this.id = id;
    this.val = val;
    this.edges = new Map<number, Edge>();
  }
  // is vertex object adjacent to given vertex ID?
  adjacent(id: number): boolean {
    return !!this.edges.get(id);
  }
}
