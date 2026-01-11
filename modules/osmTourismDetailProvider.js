// modules/osmTourismDetailProvider.js
import { OSMTourismProvider } from "./osmTourismProvider.js";

export class OSMTourismDetailProvider {
  constructor() {
    this.tourism = new OSMTourismProvider();
  }

  extractDetails(attraction) {
    return {
      name: attraction.tags?.name || null,
      type: attraction.tags?.tourism || "unknown",
      description: attraction.tags?.description || null,
      website: attraction.tags?.website || null
    };
  }
}
