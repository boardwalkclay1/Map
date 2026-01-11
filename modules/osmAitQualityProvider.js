// modules/osmAirQualityProvider.js
export class OSMAirQualityProvider {
  constructor() {
    this.base = "https://api.openaq.org/v2/latest";
  }

  async getAirQuality(lat, lng, radius = 5000) {
    const url =
      `${this.base}?coordinates=${lat},${lng}` +
      `&radius=${radius}&limit=1`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    const json = await resp.json();
    return json.results?.[0] || null;
  }
}
