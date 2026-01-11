// modules/osmCrimeProxyProvider.js
import { OSMLightingProvider } from "./osmLightingProvider.js";
import { OSMAmenityProvider } from "./osmAmenityProvider.js";

export class OSMCrimeProxyProvider {
  constructor() {
    this.lighting = new OSMLightingProvider();
    this.amenities = new OSMAmenityProvider();
  }

  async computeRisk(bbox) {
    const lamps = await this.lighting.getStreetLamps(bbox);
    const shops = await this.amenities.getShops(bbox);

    const lampCount = lamps.length;
    const shopCount = shops.length;

    const isolation = Math.max(0, 100 - shopCount * 2);
    const darkness = Math.max(0, 100 - lampCount * 1.5);

    const risk = Math.min(100, Math.round((isolation + darkness) / 2));
    return { risk, isolation, darkness };
  }
}
