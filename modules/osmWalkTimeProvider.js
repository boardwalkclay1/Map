// modules/osmWalkTimeProvider.js
import { OSMRoutingProvider } from "./osmRoutingProvider.js";

export class OSMWalkTimeProvider {
  constructor() {
    this.routing = new OSMRoutingProvider();
  }

  async estimateWalkTime(bbox, start, end) {
    await this.routing.loadRoadGraph(bbox);
    const path = await this.routing.route(start, end);
    if (!path) return null;

    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      dist += this._dist(a.lat, a.lng, b.lat, b.lng);
    }

    const walkSpeed = 1.4; // m/s
    const seconds = dist / walkSpeed;

    return {
      distance_m: Math.round(dist),
      time_minutes: Math.round(seconds / 60)
    };
  }

  _dist(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const dLat = (bLat - aLat) * Math.PI / 180;
    const dLng = (bLng - aLng) * Math.PI / 180;
    const x = dLng * Math.cos((aLat + bLat) / 2 * Math.PI / 180);
    const y = dLat;
    return Math.sqrt(x*x + y*y) * R;
  }
}
