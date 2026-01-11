// modules/osmFireStationDistanceProvider.js
import { OSMFireProvider } from "./osmFireProvider.js";

export class OSMFireStationDistanceProvider {
  constructor() {
    this.fire = new OSMFireProvider();
  }

  async nearestFireStation(bbox, lat, lng) {
    const stations = await this.fire.getFireStations(bbox);
    if (!stations.length) return null;

    let best = null;
    let bestDist = Infinity;

    for (const s of stations) {
      const d = this._dist(lat, lng, s.lat, s.lon);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }

    return { station: best, distance: bestDist };
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
