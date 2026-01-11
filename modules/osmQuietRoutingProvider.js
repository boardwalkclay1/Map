// modules/osmQuietRoutingProvider.js
import { OSMRoutingProvider } from "./osmRoutingProvider.js";
import { OSMNoiseProvider } from "./osmNoiseProvider.js";

export class OSMQuietRoutingProvider {
  constructor() {
    this.routing = new OSMRoutingProvider();
    this.noise = new OSMNoiseProvider();
  }

  async load(bbox) {
    await this.routing.loadRoadGraph(bbox);
  }

  async quietRoute(start, end, airports = [], highways = []) {
    const baseRoute = await this.routing.route(start, end);
    if (!baseRoute) return null;

    return baseRoute.map(p => {
      const noise = this.noise.estimateNoiseLevel(p.lat, p.lng, airports, highways);
      return { ...p, noise };
    });
  }
}
