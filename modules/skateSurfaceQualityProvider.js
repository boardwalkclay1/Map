import { OSMRoadQualityProvider } from "./osmRoadQualityProvider.js";

export class SkateSurfaceQualityProvider {
  constructor() {
    this.road = new OSMRoadQualityProvider();
  }

  async getSkateableSurfaces(bbox) {
    const roads = await this.road.getRoadQuality(bbox);
    return roads.filter(r =>
      ["asphalt", "paved", "concrete"].includes(r.tags?.surface)
    );
  }

  computeSkateScore(road) {
    const surface = road.tags?.surface || "unknown";
    const smooth = road.tags?.smoothness || "unknown";

    let score = 50;
    if (surface === "asphalt") score += 20;
    if (surface === "concrete") score += 15;
    if (smooth === "excellent") score += 25;
    if (smooth === "good") score += 10;
    if (smooth === "bad") score -= 30;

    return Math.max(0, Math.min(100, score));
  }
}

