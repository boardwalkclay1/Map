import { OSMRoutingProvider } from "./osmRoutingProvider.js";

export class SkateFlowProvider {
  constructor() {
    this.route = new OSMRoutingProvider();
  }

  async computeFlow(bbox) {
    await this.route.loadRoadGraph(bbox);
    return this.route.graph.size; // more nodes = better flow
  }
}
