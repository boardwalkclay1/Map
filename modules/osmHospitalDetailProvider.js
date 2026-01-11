// modules/osmHospitalDetailProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMHospitalDetailProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getHospitals(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "node[amenity=hospital]",
      "way[amenity=hospital]"
    ]);
  }

  extractDetails(hospital) {
    return {
      name: hospital.tags?.name || null,
      emergency: hospital.tags?.emergency || "unknown",
      beds: hospital.tags?.beds || "unknown",
      contact: hospital.tags?.contact || null
    };
  }
}
