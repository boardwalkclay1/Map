// modules/osmHospitalDistanceProvider.js
import { OSMHospitalDetailProvider } from "./osmHospitalDetailProvider.js";

export class OSMHospitalDistanceProvider {
  constructor() {
    this.hospitals = new OSMHospitalDetailProvider();
  }

  async nearestHospital(bbox, lat, lng) {
    const list = await this.hospitals.getHospitals(bbox);
    if (!list.length) return null;

    let best = null;
    let bestDist = Infinity;

    for (const h of list) {
      const d = this._dist(lat, lng, h.lat, h.lon);
      if (d < bestDist) {
        bestDist = d;
        best = h;
      }
    }

    return { hospital: best, distance: bestDist };
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
