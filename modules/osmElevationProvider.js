// modules/osmElevationProvider.js
export class OSMElevationProvider {
  constructor() {
    this.endpoint = "https://api.opentopodata.org/v1/eudem25m";
  }

  async getElevation(lat, lng) {
    const url = `${this.endpoint}?locations=${lat},${lng}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const json = await resp.json();
    return json.results?.[0]?.elevation ?? null;
  }

  async getSlope(lat, lng) {
    const e1 = await this.getElevation(lat, lng);
    const e2 = await this.getElevation(lat + 0.0001, lng + 0.0001);
    if (e1 == null || e2 == null) return null;
    return e2 - e1;
  }
}
