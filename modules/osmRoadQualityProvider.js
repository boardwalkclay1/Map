// modules/osmRoadQualityProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMRoadQualityProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
  }

  async getRoadQuality(bbox) {
    return await this.osm.getFeaturesByBBox(bbox, [
      "way[highway][surface]",
      "way[highway][smoothness]"
    ]);
  }

  computeScore(road) {
    const surface = road.tags?.surface || "unknown";
    const smooth = road.tags?.smoothness || "unknown";

    let score = 50;

    if (surface === "asphalt") score += 20;
    if (surface === "paved") score += 10;
    if (surface === "gravel") score -= 10;
    if (surface === "dirt") score -= 20;

    if (smooth === "excellent") score += 20;
    if (smooth === "bad") score -= 20;

    return Math.max(0, Math.min(100, score));
  }
}
