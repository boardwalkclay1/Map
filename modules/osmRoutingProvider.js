// modules/osmRoutingProvider.js
import { OSMFeatureProvider } from "./osmFeatureProvider.js";

export class OSMRoutingProvider {
  constructor() {
    this.osm = new OSMFeatureProvider();
    this.graph = new Map();
  }

  async loadRoadGraph(bbox) {
    const roads = await this.osm.getRoads(bbox);
    this.graph.clear();

    for (const way of roads) {
      if (!way.nodes || way.nodes.length < 2) continue;

      for (let i = 0; i < way.nodes.length - 1; i++) {
        const a = way.nodes[i];
        const b = way.nodes[i + 1];

        this._addEdge(a, b);
        this._addEdge(b, a);
      }
    }
  }

  _addEdge(a, b) {
    const key = `${a.lat},${a.lon}`;
    if (!this.graph.has(key)) this.graph.set(key, []);
    const dist = this._haversine(a.lat, a.lon, b.lat, b.lon);
    this.graph.get(key).push({
      lat: b.lat,
      lng: b.lon,
      cost: dist
    });
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

  async route(start, end) {
    const startKey = `${start.lat},${start.lng}`;
    const endKey = `${end.lat},${end.lng}`;

    const open = new Set([startKey]);
    const cameFrom = new Map();
    const gScore = new Map([[startKey, 0]]);
    const fScore = new Map([[startKey, this._haversine(start.lat, start.lng, end.lat, end.lng)]]);

    while (open.size) {
      let current = [...open].sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity))[0];
      if (current === endKey) return this._reconstruct(cameFrom, current);

      open.delete(current);
      const [lat, lng] = current.split(",").map(Number);
      const neighbors = this.graph.get(current) || [];

      for (const n of neighbors) {
        const nk = `${n.lat},${n.lng}`;
        const tentative = (gScore.get(current) || Infinity) + n.cost;

        if (tentative < (gScore.get(nk) || Infinity)) {
          cameFrom.set(nk, current);
          gScore.set(nk, tentative);
          fScore.set(nk, tentative + this._haversine(n.lat, n.lng, end.lat, end.lng));
          open.add(nk);
        }
      }
    }

    return null;
  }

  _reconstruct(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(current);
    }
    return path.map(p => {
      const [lat, lng] = p.split(",").map(Number);
      return { lat, lng };
    });
  }
}
