// modules/osmHeatmapProvider.js
export class OSMHeatmapProvider {
  constructor(options = {}) {
    this.radius = options.radius || 50; // meters
    this.intensity = options.intensity || 1;
  }

  generateHeatmap(points, bbox, resolution = 256) {
    const [minLat, minLng, maxLat, maxLng] = bbox;

    const grid = [];
    for (let y = 0; y < resolution; y++) {
      grid[y] = new Array(resolution).fill(0);
    }

    for (const p of points) {
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const lat = minLat + (y / resolution) * (maxLat - minLat);
          const lng = minLng + (x / resolution) * (maxLng - minLng);

          const d = this._haversine(lat, lng, p.lat, p.lng);
          if (d <= this.radius) {
            const weight = (1 - d / this.radius) * this.intensity;
            grid[y][x] += weight;
          }
        }
      }
    }

    return grid;
  }

  _haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat1*Math.PI/180) *
      Math.cos(lat2*Math.PI/180) *
      Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
}
