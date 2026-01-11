// modules/osmFeatureProvider.js
export class OSMFeatureProvider {
  constructor(options = {}) {
    this.endpoint = options.endpoint || "https://overpass-api.de/api/interpreter";
    this.timeout = options.timeout || 25000;
  }

  async query(rawQuery) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    const body = `[out:json][timeout:25];${rawQuery};out body geom;`;

    try {
      const resp = await fetch(this.endpoint, {
        method: "POST",
        body,
        signal: controller.signal
      });
      clearTimeout(id);
      if (!resp.ok) return null;
      const json = await resp.json();
      return json.elements || [];
    } catch {
      return null;
    }
  }

  async getFeaturesByBBox(bbox, filters = []) {
    const [minLat, minLng, maxLat, maxLng] = bbox;
    const filterStr = filters.length
      ? filters.map(f => `(${f})`).join("")
      : "(node;way;relation)";

    const q = `
      (
        ${filterStr}
        (${minLat},${minLng},${maxLat},${maxLng});
      );
    `;
    return await this.query(q);
  }

  async getRoads(bbox) {
    return await this.getFeaturesByBBox(bbox, ["way[highway]"]);
  }

  async getBuildings(bbox) {
    return await this.getFeaturesByBBox(bbox, ["way[building]"]);
  }

  async getLanduse(bbox) {
    return await this.getFeaturesByBBox(bbox, ["way[landuse]"]);
  }

  async getPOI(bbox) {
    return await this.getFeaturesByBBox(bbox, ["node[amenity]"]);
  }
}
