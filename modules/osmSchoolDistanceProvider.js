// modules/osmSchoolDistanceProvider.js
import { OSMAmenityProvider } from "./osmAmenityProvider.js";

export class OSMSchoolDistanceProvider {
  constructor() {
    this.amenities = new OSMAmenityProvider();
  }

  async nearestSchool(bbox, lat, lng) {
    const schools = await this.amenities.getSchools(bbox);
    if (!schools.length) return null;

    let best = null;
    let bestDist = Infinity;

    for (const s of schools) {
      const d = this._dist(lat, lng, s.lat, s.lon);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }

    return { school: best, distance: bestDist };
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
