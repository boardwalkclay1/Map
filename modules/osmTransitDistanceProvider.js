// modules/osmTransitDistanceProvider.js
import { OSMPublicTransportationProvider } from "./osmPublicTransportationProvider.js";

export class OSMTransitDistanceProvider {
  constructor() {
    this.transit = new OSMPublicTransportationProvider();
  }

  async nearestTransitStop(bbox, lat, lng) {
    const stops = await this.transit.getStops(bbox);
    if (!stops.length) return null;

    let best = null;
    let bestDist = Infinity;

    for (const s of stops) {
      const d = this._dist(lat, lng, s.lat, s.lon);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }

    return { stop: best, distance: bestDist };
  }

  _dist(aLat, aLng, bLat, bLng) {
    const R = 6371000;
    const dLat = (bLat - aLat) * Math.PI / 180;
    const dLng = (bLng - aLng) * Math.PI / 180;
    const x = dLng * Math.cos((aLat + bLat) / 2 * Math.PI / 180);
    const y = dLat;
    return Math.sqrt(x * x + y * y) * R;
  }
}
