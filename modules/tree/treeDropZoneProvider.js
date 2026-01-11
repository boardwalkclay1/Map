import { OSMLanduseProvider } from "./osmLanduseProvider.js";

export class TreeDropZoneProvider {
  constructor() {
    this.land = new OSMLanduseProvider();
  }

  async getDropZones(bbox) {
    return await this.land.getLanduse(bbox); // open areas = potential drop zones
  }
}
