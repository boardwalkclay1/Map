// modules/osmBoundaryProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMBoundaryProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getCountries() {
    return await this.osm.query(`
      relation["admin_level"="2"];
    `);
  }

  async getStates(countryName) {
    return await this.osm.query(`
      relation["admin_level"="4"]["name"="${countryName}"];
    `);
  }

  async getCities(stateName) {
    return await this.osm.query(`
      relation["admin_level"="8"]["name"="${stateName}"];
    `);
  }
}
