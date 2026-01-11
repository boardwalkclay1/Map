// modules/osmNoiseProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMNoiseProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getAirports(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[aeroway=aerodrome]",
      "node[aeroway=aerodrome]"
    ]);
  }

  async getHighways(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway=motorway]",
      "way[highway=trunk]"
    ]);
  }

  estimateNoiseLevel(lat, lng, airports = [], highways = []) {
    let noise = 0;

    for (const a of airports) {
      const d = this._dist(lat, lng, a.lat, a.lon);
      if (d < 5000) noise += (5000 - d) / 5000 * 50;
    }

    for (const h of highways) {
      const d = this._dist(lat, lng, h.lat, h.lon);
      if (d < 1000) noise += (1000 - d) / 1000 * 30;
    }

    return Math.min(100, Math.round(noise));
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
