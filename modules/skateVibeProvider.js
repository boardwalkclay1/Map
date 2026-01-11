import { OSMAmenityProvider } from "./osmAmenityProvider.js";
import { OSMLightingProvider } from "./osmLightingProvider.js";
import { OSMGreenProvider } from "./osmGreenProvider.js";

export class SkateVibeProvider {
  constructor() {
    this.amen = new OSMAmenityProvider();
    this.light = new OSMLightingProvider();
    this.green = new OSMGreenProvider();
  }

  async computeVibe(bbox) {
    const shops = await this.amen.getShops(bbox);
    const lamps = await this.light.getStreetLamps(bbox);
    const trees = await this.green.getTrees(bbox);

    return Math.min(100, shops.length + lamps.length + trees.length * 0.5);
  }
}
