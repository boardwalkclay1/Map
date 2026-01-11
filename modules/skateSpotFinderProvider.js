import { SkateSurfaceQualityProvider } from "./skateSurfaceQualityProvider.js";
import { SkateVibeProvider } from "./skateVibeProvider.js";

export class SkateSpotFinderProvider {
  constructor() {
    this.surface = new SkateSurfaceQualityProvider();
    this.vibe = new SkateVibeProvider();
  }

  async findSpots(bbox) {
    const surfaces = await this.surface.getSkateableSurfaces(bbox);
    const vibe = await this.vibe.computeVibe(bbox);

    return surfaces
      .map(s => ({
        lat: s.lat,
        lng: s.lon,
        score: this.surface.computeSkateScore(s) + vibe
      }))
      .sort((a, b) => b.score - a.score);
  }
}
