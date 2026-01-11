// modules/osmFloodProvider.js
import { OSMWaterProvider } from "./osmWaterProvider.js";

export class OSMFloodProvider {
  constructor() {
    this.water = new OSMWaterProvider();
  }

  async getFloodRisk(bbox, lat, lng) {
    const rivers = await this.water.getRivers(bbox);
    const lakes = await this.water.getLakes(bbox);

    let risk = 0;

    for (const r of rivers) {
      const d = this._dist(lat, lng, r.lat, r.lon);
      if (d < 2000) risk += (2000 - d) / 2000 * 60;
    }

    for (const l of lakes) {
      const d = this._dist(lat, lng, l.lat, l.lon);
      if (d < 3000) risk += (3000 - d) / 3000 * 40;
    }

    return Math.min(100, Math.round(risk));
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
