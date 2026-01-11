// modules/osmEarthquakeProvider.js
export class OSMEarthquakeProvider {
  constructor() {
    this.base = "https://earthquake.usgs.gov/fdsnws/event/1/query";
  }

  async getEarthquakes(bbox, minMagnitude = 2.5) {
    const [minLat, minLng, maxLat, maxLng] = bbox;

    const url =
      `${this.base}?format=geojson` +
      `&minlatitude=${minLat}&maxlatitude=${maxLat}` +
      `&minlongitude=${minLng}&maxlongitude=${maxLng}` +
      `&minmagnitude=${minMagnitude}`;

    const resp = await fetch(url);
    if (!resp.ok) return null;

    const json = await resp.json();
    return json.features || [];
  }
}
