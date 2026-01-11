// modules/osmIsochroneProvider.js
import { OSMRoutingProvider } from "./osmRoutingProvider.js";

export class OSMIsochroneProvider {
  constructor() {
    this.routing = new OSMRoutingProvider();
  }

  async buildIsochrone(bbox, start, maxDistance = 2000) {
    await this.routing.loadRoadGraph(bbox);

    const startKey = `${start.lat},${start.lng}`;
    const queue = [{ key: startKey, dist: 0 }];
    const visited = new Map([[startKey, 0]]);

    while (queue.length) {
      const { key, dist } = queue.shift();
      const neighbors = this.routing.graph.get(key) || [];

      for (const n of neighbors) {
        const nk = `${n.lat},${n.lng}`;
        const nd = dist + n.cost;

        if (nd <= maxDistance && (!visited.has(nk) || nd < visited.get(nk))) {
          visited.set(nk, nd);
          queue.push({ key: nk, dist: nd });
        }
      }
    }

    return [...visited.keys()].map(k => {
      const [lat, lng] = k.split(",").map(Number);
      return { lat, lng };
    });
  }
}
