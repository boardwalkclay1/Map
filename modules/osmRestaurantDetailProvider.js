// modules/osmRestaurantDetailProvider.js
import { OSMAmenityProvider } from "./osmAmenityProvider.js";

export class OSMRestaurantDetailProvider {
  constructor() {
    this.amenities = new OSMAmenityProvider();
  }

  async getRestaurants(bbox) {
    return await this.amenities.getRestaurants(bbox);
  }

  extractDetails(r) {
    return {
      name: r.tags?.name || null,
      cuisine: r.tags?.cuisine || "unknown",
      opening_hours: r.tags?.opening_hours || "unknown",
      takeaway: r.tags?.takeaway || "unknown"
    };
  }
}
