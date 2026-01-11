// modules/osmShadeProvider.js
import { OSMGreenProvider } from "./osmGreenProvider.js";
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMShadeProvider {
  constructor() {
    this.green = new OSMGreenProvider();
    this.osm = new OSMFeatureProvider();
  }

  async computeShade(bbox, lat, lng) {
    const trees = await this.green.getTrees(bbox);
    const buildings = await this.osm.getBuildings(bbox);

    let shade = 0;

    for (const t of trees) {
      const d = this._dist(lat, lng, t.lat, t.lon);
      if (d < 50) shade += (50 - d) / 50 * 30;
    }

    for (const b of buildings) {
      const d = this._dist(lat, lng, b.lat, b.lon);
      if (d < 80) shade += (80 - d) / 80 * 40;
    }

    return Math.min(100, Math.round(shade));
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
