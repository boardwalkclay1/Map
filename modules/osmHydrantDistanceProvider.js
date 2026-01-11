// modules/osmHydrantDistanceProvider.js
import { OSMFireProvider } from "./osmFireProvider.js";

export class OSMHydrantDistanceProvider {
  constructor() {
    this.fire = new OSMFireProvider();
  }

  async nearestHydrant(bbox, lat, lng) {
    const hydrants = await this.fire.getFireHydrants(bbox);
    if (!hydrants.length) return null;

    let best = null;
    let bestDist = Infinity;

    for (const h of hydrants) {
      const d = this._dist(lat, lng, h.lat, h.lon);
      if (d < bestDist) {
        bestDist = d;
        best = h;
      }
    }

    return { hydrant: best, distance: bestDist };
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
