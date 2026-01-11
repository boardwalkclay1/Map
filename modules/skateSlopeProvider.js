import { OSMSlopeProvider } from "./osmSlopeProvider.js";

export class SkateSlopeProvider {
  constructor() {
    this.slope = new OSMSlopeProvider();
  }

  async computeSkateSlope(bbox) {
    const grid = await this.slope.generateSlopeGrid(bbox, 16);
    const slope = Math.abs(grid[8][8] || 0);

    if (slope < 2) return "flat";
    if (slope < 6) return "mild";
    if (slope < 12) return "steep";
    return "dangerous";
  }
}
