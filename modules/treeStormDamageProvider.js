import { OSMWeatherProvider } from "./osmWeatherProvider.js";
import { OSMGreenProvider } from "./osmGreenProvider.js";

export class TreeStormDamageProvider {
  constructor() {
    this.weather = new OSMWeatherProvider();
    this.green = new OSMGreenProvider();
  }

  async computeStormRisk(bbox, lat, lng) {
    const weather = await this.weather.getWeather(lat, lng);
    const trees = await this.green.getTrees(bbox);

    const wind = weather?.current_weather?.windspeed || 0;
    const density = trees.length;

    return Math.min(100, Math.round(wind * 2 + density * 0.5));
  }
}
