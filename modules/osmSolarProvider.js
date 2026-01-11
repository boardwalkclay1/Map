// modules/osmSolarProvider.js
export class OSMSolarProvider {
  constructor() {
    this.base = "https://api.open-meteo.com/v1/forecast";
  }

  async getSolar(lat, lng) {
    const url =
      `${this.base}?latitude=${lat}&longitude=${lng}` +
      `&hourly=shortwave_radiation,direct_radiation,diffuse_radiation,sunshine_duration`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    return await resp.json();
  }

  async getSunPosition(lat, lng, date = new Date()) {
    const ts = date.toISOString().split("T")[0];
    const url =
      `${this.base}?latitude=${lat}&longitude=${lng}` +
      `&daily=sunrise,sunset&start_date=${ts}&end_date=${ts}`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    return await resp.json();
  }
}
