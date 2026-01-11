// modules/osmTurnRestrictionProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMTurnRestrictionProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getTurnRestrictions(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=restriction]'
    ]);
  }

  async getNoLeftTurns(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=restriction][restriction=no_left_turn]'
    ]);
  }

  async getNoRightTurns(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=restriction][restriction=no_right_turn]'
    ]);
  }

  async getNoUTurns(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      'relation[type=restriction][restriction=no_u_turn]'
    ]);
  }
}
