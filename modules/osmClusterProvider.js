// modules/osmClusterProvider.js
export class OSMClusterProvider {
  constructor(options = {}) {
    this.radius = options.radius || 60; // pixels
  }

  cluster(points, zoom) {
    const clusters = [];
    const visited = new Set();

    for (let i = 0; i < points.length; i++) {
      if (visited.has(i)) continue;

      const cluster = {
        lat: points[i].lat,
        lng: points[i].lng,
        points: [points[i]]
      };

      for (let j = i + 1; j < points.length; j++) {
        if (visited.has(j)) continue;

        const d = this._pixelDistance(points[i], points[j], zoom);
        if (d <= this.radius) {
          visited.add(j);
          cluster.points.push(points[j]);
        }
      }

      clusters.push(cluster);
    }

    return clusters;
  }

  _pixelDistance(a, b, zoom) {
    const scale = 256 * Math.pow(2, zoom);
    const x1 = (a.lng + 180) / 360 * scale;
    const y1 = this._mercY(a.lat) * scale;
    const x2 = (b.lng + 180) / 360 * scale;
    const y2 = this._mercY(b.lat) * scale;
    return Math.hypot(x2 - x1, y2 - y1);
  }

  _mercY(lat) {
    const rad = lat * Math.PI / 180;
    return (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2;
  }
}
