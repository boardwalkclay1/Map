// modules/osmFireRiskProvider.js
import { OSMGreenProvider } from "./osmGreenProvider.js";
import { OSMSlopeProvider } from "./osmSlopeProvider.js";
import { OSMWeatherProvider } from "./osmWeatherProvider.js";

export class OSMFireRiskProvider {
  constructor() {
    this.green = new OSMGreenProvider();
    this.slope = new OSMSlopeProvider();
    this.weather = new OSMWeatherProvider();
  }

  async computeFireRisk(bbox, lat, lng) {
    const trees = await this.green.getTrees(bbox);
    const slopeGrid = await this.slope.generateSlopeGrid(bbox, 16);
    const weather = await this.weather.getWeather(lat, lng);

    const slopeVal = slopeGrid[8][8] || 0;
    const wind = weather?.current_weather?.windspeed || 0;
    const treeDensity = trees.length;

    const risk =
      Math.min(100,
        Math.round(
          treeDensity * 0.2 +
          slopeVal * 0.5 +
          wind * 1.2
        )
      );

    return risk;
  }
}
