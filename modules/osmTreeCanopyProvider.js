// modules/osmTreeCanopyProvider.js
import { OSMGreenProvider } from "./osmGreenProvider.js";

export class OSMTreeCanopyProvider {
  constructor() {
    this.green = new OSMGreenProvider();
  }

  async generateCanopyGrid(bbox, resolution = 128) {
    const trees = await this.green.getTrees(bbox);
    const [minLat, minLng, maxLat, maxLng] = bbox;

    const grid = [];
    for (let y = 0; y < resolution; y++) {
      grid[y] = new Array(resolution).fill(0);
    }

    for (const t of trees) {
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const lat = minLat + (y / resolution) * (maxLat - minLat);
          const lng = minLng + (x / resolution) * (maxLng - minLng);

          const d = this._dist(lat, lng, t.lat, t.lon);
          if (d < 50) {
            grid[y][x] += (50 - d) / 50;
          }
        }
      }
    }

    return grid;
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
