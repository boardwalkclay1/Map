// modules/osmTransitQualityProvider.js
import { OSMPublicTransportProvider } from "./osmPublicTransportProvider.js";
import { OSMTransitProvider } from "./osmTransitProvider.js";

export class OSMTransitQualityProvider {
  constructor() {
    this.stops = new OSMPublicTransportProvider();
    this.routes = new OSMTransitProvider();
  }

  async computeTransitQuality(bbox) {
    const stops = await this.stops.getStops(bbox);
    const bus = await this.routes.getBusRoutes(bbox);
    const train = await this.routes.getTrainRoutes(bbox);

    const score = Math.min(
      100,
      Math.round(
        stops.length * 0.5 +
        bus.length * 2 +
        train.length * 3
      )
    );

    return score;
  }
}
