// modules/osmNoiseRouteProvider.js
import { OSMRoutingProvider } from "./osmRoutingProvider.js";
import { OSMNoiseProvider } from "./osmNoiseProvider.js";

export class OSMNoiseRouteProvider {
  constructor() {
    this.routing = new OSMRoutingProvider();
    this.noise = new OSMNoiseProvider();
  }

  async load(bbox) {
    await this.routing.loadRoadGraph(bbox);
    this.airports = await this.noise.getAirports(bbox);
    this.highways = await this.noise.getHighways(bbox);
  }

  async routeWithNoise(start, end) {
    const baseRoute = await this.routing.route(start, end);
    if (!baseRoute) return null;

    return baseRoute.map(p => {
      const noise = this.noise.estimateNoiseLevel(
        p.lat,
        p.lng,
        this.airports,
        this.highways
      );
      return { ...p, noiseCost: noise };
    });
  }
}
