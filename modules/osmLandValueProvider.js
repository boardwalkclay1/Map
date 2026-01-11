// modules/osmLandValueProvider.js
import { OSMAmenityProvider } from "./osmAmenityProvider.js";
import { OSMTransitProvider } from "./osmTransitProvider.js";
import { OSMGreenProvider } from "./osmGreenProvider.js";

export class OSMLandValueProvider {
  constructor() {
    this.amenities = new OSMAmenityProvider();
    this.transit = new OSMTransitProvider();
    this.green = new OSMGreenProvider();
  }

  async computeLandValue(bbox) {
    const shops = await this.amenities.getShops(bbox);
    const transit = await this.transit.getBusRoutes(bbox);
    const trees = await this.green.getTrees(bbox);

    const score =
      Math.min(100,
        Math.round(
          shops.length * 0.5 +
          transit.length * 2 +
          trees.length * 0.2
        )
      );

    return score;
  }
}
