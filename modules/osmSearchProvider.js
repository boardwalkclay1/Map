// modules/osmSearchProvider.js
export class OSMSearchProvider {
  constructor() {
    this.base = "https://nominatim.openstreetmap.org";
  }

  async search(query) {
    const url = `${this.base}/search?format=json&q=${encodeURIComponent(query)}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    return await resp.json();
  }

  async reverse(lat, lng) {
    const url = `${this.base}/reverse?format=json&lat=${lat}&lon=${lng}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return await resp.json();
  }
}
