// modules/osmNoiseActivityProvider.js
import { OSMNoiseProvider } from "./osmNoiseProvider.js";
import { OSMAmenityProvider } from "./osmAmenityProvider.js";

export class OSMNoiseActivityProvider {
  constructor() {
    this.noise = new OSMNoiseProvider();
    this.amenities = new OSMAmenityProvider();
  }

  async generateHybridGrid(bbox, resolution = 128) {
    const [minLat, minLng, maxLat, maxLng] = bbox;

    const grid = [];
    for (let y = 0; y < resolution; y++) {
      grid[y] = new Array(resolution).fill(0);
    }

    const airports = await this.noise.getAirports(bbox);
    const highways = await this.noise.getHighways(bbox);
    const shops = await this.amenities.getShops(bbox);

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const lat = minLat + (y / resolution) * (maxLat - minLat);
        const lng = minLng + (x / resolution) * (maxLng - minLng);

        const noise = this.noise.estimateNoiseLevel(lat, lng, airports, highways);
        const activity = shops.length;

        grid[y][x] = Math.min(100, Math.round(noise * 0.6 + activity * 0.4));
      }
    }

    return grid;
  }
}
