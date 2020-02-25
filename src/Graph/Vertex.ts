import Edge from './Edge';

export default class Vertex<K, V> {
  id: K;
  val: V;
  edges: Map<K, Edge>;

  constructor(id: K, val: V) {
    this.id = id;
    this.val = val;
    this.edges = new Map<K, Edge>();
  }
  // is vertex object adjacent to given vertex ID?
  adjacent(id: K): boolean {
    return !!this.edges.get(id);
  }
}
