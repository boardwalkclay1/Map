// modules/osmSnowProvider.js
import { OSMElevationProvider } from "./osmElevationProvider.js";
import { OSMWeatherProvider } from "./osmWeatherProvider.js";

export class OSMSnowProvider {
  constructor() {
    this.elev = new OSMElevationProvider();
    this.weather = new OSMWeatherProvider();
  }

  async computeSnowRisk(lat, lng) {
    const elevation = await this.elev.getElevation(lat, lng);
    const weather = await this.weather.getWeather(lat, lng);

    const temp = weather?.current_weather?.temperature ?? 10;
    const wind = weather?.current_weather?.windspeed ?? 0;
    const base = (elevation || 0) / 50 + (0 - temp) * 2 + wind * 0.5;

    return Math.max(0, Math.min(100, Math.round(base)));
  }
}
