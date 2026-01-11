// modules/osmSlopeProvider.js
import { OSMElevationProvider } from "./osmElevationProvider.js";

export class OSMSlopeProvider {
  constructor() {
    this.elev = new OSMElevationProvider();
  }

  async generateSlopeGrid(bbox, resolution = 64) {
    const [minLat, minLng, maxLat, maxLng] = bbox;
    const grid = [];

    for (let y = 0; y < resolution; y++) {
      grid[y] = new Array(resolution).fill(0);
    }

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const lat = minLat + (y / resolution) * (maxLat - minLat);
        const lng = minLng + (x / resolution) * (maxLng - minLng);
        const slope = await this.elev.getSlope(lat, lng);
        grid[y][x] = slope ?? 0;
      }
    }

    return grid;
  }
}
