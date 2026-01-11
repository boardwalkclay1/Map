// modules/osmNoiseHeatmapProvider.js
import { OSMNoiseProvider } from "./osmNoiseProvider.js";

export class OSMNoiseHeatmapProvider {
  constructor() {
    this.noise = new OSMNoiseProvider();
  }

  async generateNoiseGrid(bbox, resolution = 128) {
    const [minLat, minLng, maxLat, maxLng] = bbox;

    const grid = [];
    for (let y = 0; y < resolution; y++) {
      grid[y] = new Array(resolution).fill(0);
    }

    const airports = await this.noise.getAirports(bbox);
    const highways = await this.noise.getHighways(bbox);

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const lat = minLat + (y / resolution) * (maxLat - minLat);
        const lng = minLng + (x / resolution) * (maxLng - minLng);
        grid[y][x] = this.noise.estimateNoiseLevel(lat, lng, airports, highways);
      }
    }

    return grid;
  }
}
