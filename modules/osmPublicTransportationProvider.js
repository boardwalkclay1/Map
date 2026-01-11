// modules/osmPublicTransportationProvider.js

export class OSMPublicTransportationProvider {
  constructor() {}

  /**
   * Fetch transit stops inside a bounding box.
   * bbox = [minLon, minLat, maxLon, maxLat]
   */
  async getStops(bbox) {
    const [minLon, minLat, maxLon, maxLat] = bbox;

    const url = `https://overpass-api.de/api/interpreter?data=[out:json];
      node["public_transport"="platform"](${minLat},${minLon},${maxLat},${maxLon});
      out;`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.elements) return [];

      return data.elements.map(el => ({
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: el.tags?.name || "Unnamed Stop",
        frequency: this._estimateFrequency(el.tags)
      }));
    } catch (err) {
      console.error("Transit provider error:", err);
      return [];
    }
  }

  /**
   * Simple scoring function for transit frequency.
   */
  _estimateFrequency(tags) {
    if (!tags) return 0;

    if (tags.interval) {
      const interval = parseInt(tags.interval, 10);
      return interval > 0 ? 60 / interval : 0;
    }

    return 1;
  }
}
