// modules/osmDisasterAccessProvider.js
import { OSMEmergencyProvider } from "./osmEmergencyProvider.js";
import { OSMFloodProvider } from "./osmFloodProvider.js";
import { OSMEarthquakeProvider } from "./osmEarthquakeProvider.js";

export class OSMDisasterAccessProvider {
  constructor() {
    this.emergency = new OSMEmergencyProvider();
    this.flood = new OSMFloodProvider();
    this.quakes = new OSMEarthquakeProvider();
  }

  async computeDisasterAccess(bbox, lat, lng) {
    const stations = await this.emergency.getAmbulanceStations(bbox);
    const police = await this.emergency.getPoliceStations(bbox);
    const floodRisk = await this.flood.getFloodRisk(bbox, lat, lng);
    const quakes = await this.quakes.getEarthquakes(bbox, 4.0);

    const stationScore = (stations.length + police.length) * 5;
    const floodPenalty = floodRisk * 0.5;
    const quakePenalty = quakes.length * 2;

    const score = Math.max(
      0,
      Math.min(100, Math.round(stationScore - floodPenalty - quakePenalty))
    );

    return score;
  }
}
