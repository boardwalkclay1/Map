// modules/osmDeliveryProvider.js
import { OSMRoutingProvider } from "./osmRoutingProvider.js";
import { OSMParkingProvider } from "./osmParkingProvider.js";
import { OSMTrafficProvider } from "./osmTrafficProvider.js";

export class OSMDeliveryProvider {
  constructor(options = {}) {
    this.routing = new OSMRoutingProvider();
    this.parking = new OSMParkingProvider();
    this.traffic = new OSMTrafficProvider({ apiKey: options.apiKey });
  }

  async computeDeliveryScore(bbox, lat, lng) {
    await this.routing.loadRoadGraph(bbox);
    const lots = await this.parking.getParkingLots(bbox);
    const traffic = await this.traffic.getTraffic(lat, lng);

    const parkScore = lots.length * 3;
    const trafficSpeed = traffic?.flowSegmentData?.currentSpeed || 30;
    const trafficScore = Math.max(0, 50 - (trafficSpeed - 20) * 2);

    const score = Math.min(100, Math.round(parkScore + trafficScore));
    return score;
  }
}
