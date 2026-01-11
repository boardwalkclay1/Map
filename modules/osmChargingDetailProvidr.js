// modules/osmChargingDetailProvider.js
import { OSMEVChargingProvider } from "./osmEVChargingProvider.js";

export class OSMChargingDetailProvider {
  constructor() {
    this.ev = new OSMEVChargingProvider();
  }

  extractDetails(station) {
    return {
      name: station.tags?.name || null,
      sockets: station.tags?.socket || null,
      speed: station.tags?.charging_speed || "unknown",
      operator: station.tags?.operator || null
    };
  }
}
