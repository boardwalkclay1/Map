// modules/osmWeatherProvider.js
export class OSMWeatherProvider {
  constructor() {
    this.base = "https://api.open-meteo.com/v1/forecast";
  }

  async getWeather(lat, lng) {
    const url =
      `${this.base}?latitude=${lat}&longitude=${lng}` +
      `&current_weather=true&hourly=temperature_2m,precipitation,cloudcover,windspeed_10m`;

    const resp = await fetch(url);
    if (!resp.ok) return null;
    return await resp.json();
  }

  async getForecast(lat, lng) {
    const url =
      `${this.base}?latitude=${lat}&longitude=${lng}` +
      `&hourly=temperature_2m,precipitation_probability,visibility,windspeed_10m`;

    const resp = await fetch(url);
    if (!resp.ok) return null;
    return await resp.json();
  }
}
