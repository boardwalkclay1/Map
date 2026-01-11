// modules/osmPopulationProvider.js
export class OSMPopulationProvider {
  constructor() {
    this.base = "https://api.worldpop.org/v1/services/stats";
  }

  async getPopulation(lat, lng) {
    const url =
      `${this.base}?latitude=${lat}&longitude=${lng}&radius=1000`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    return await resp.json();
  }
}
