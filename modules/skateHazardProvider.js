import { OSMHazardProvider } from "./osmHazardProvider.js";

export class SkateHazardProvider {
  constructor() {
    this.haz = new OSMHazardProvider();
  }

  async getSkateHazards(bbox) {
    const bumps = await this.haz.getSpeedBumps(bbox);
    const crossings = await this.haz.getCrosswalks(bbox);
    return { bumps, crossings };
  }
}
