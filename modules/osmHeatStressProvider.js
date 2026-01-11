// modules/osmHeatStressProvider.js
import { OSMWeatherProvider } from "./osmWeatherProvider.js";
import { OSMLanduseProvider } from "./osmLanduseProvider.js";

export class OSMHeatStressProvider {
  constructor() {
    this.weather = new OSMWeatherProvider();
    this.landuse = new OSMLanduseProvider();
  }

  async computeHeatStress(bbox, lat, lng) {
    const weather = await this.weather.getWeather(lat, lng);
    const landuse = await this.landuse.getLanduse(bbox);

    const temp = weather?.current_weather?.temperature ?? 25;
    const wind = weather?.current_weather?.windspeed ?? 2;
    const urbanFraction = landuse.length;

    const stress =
      Math.min(100,
        Math.round(
          (temp - 20) * 3 +
          urbanFraction * 0.3 -
          wind * 1
        )
      );

    return Math.max(0, stress);
  }
}
