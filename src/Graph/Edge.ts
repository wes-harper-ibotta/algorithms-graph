// to and from represent weights, not IDs
// IDs are stored on each vertex
// this provides a slight lookup optimization for certain cases but increases overhead for edge creation and updates
export type EdgeWeight = number | null;

export default class Edge {
  to: EdgeWeight;
  from: EdgeWeight;

  constructor(to: EdgeWeight = null, from: EdgeWeight = null) {
    this.to = to;
    this.from = from;
  }

  nullified(): boolean {
    return this.to === null && this.from === null;
  }
}
