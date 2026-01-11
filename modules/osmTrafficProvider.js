// modules/osmTrafficProvider.js
export class OSMTrafficProvider {
  constructor(options = {}) {
    this.apiKey = options.apiKey || null;
    this.base = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json";
  }

  async getTraffic(lat, lng) {
    if (!this.apiKey) return null;

    const url =
      `${this.base}?point=${lat},${lng}&key=${this.apiKey}`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    return await resp.json();
  }
}
