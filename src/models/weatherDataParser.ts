import {
  WeatherData,
  StructureWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
} from "../types/weatherTypes";
import { WMOWeatherTexts, uvDescriptions } from "../utils/constants";
import { getUvRiskLevel } from "../utils/utils";

export class WeatherDataParser {
  private weatherData: WeatherData;
  private pastDays: number;
  private forecastDays: number;

  constructor(
    weatherData: WeatherData,
    pastDays: number,
    forecastDays: number,
  ) {
    this.weatherData = weatherData;
    this.pastDays = pastDays;
    this.forecastDays = forecastDays;
  }

  public parse(): StructureWeatherData {
    const currentDayIndex = this.pastDays;
    const forecastDayStartIndex = currentDayIndex + 1;
    const totalDays = this.pastDays + this.forecastDays;

    return {
      pastDay: this.processWeatherData(0, currentDayIndex),
      currentDay: this.processWeatherData(
        currentDayIndex,
        forecastDayStartIndex,
      )[0],
      forecast: this.processWeatherData(forecastDayStartIndex, totalDays),
      timezone: this.weatherData.timezone,
    };
  }

  private processWeatherData(
    startIndex: number,
    endIndex: number,
  ): DailyWeatherData[] {
    const { daily, hourly } = this.weatherData;
    const structuredDays: DailyWeatherData[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      structuredDays.push({
        day: { value: daily.time[i], unit: "iso8601" },
        temperatureMax: { value: daily.temperature_2m_max[i], unit: "ºC" },
        temperatureMin: { value: daily.temperature_2m_min[i], unit: "ºC" },
        sunrise: { value: daily.sunrise[i], unit: "iso8601" },
        sunset: { value: daily.sunset[i], unit: "iso8601" },
        daylightDuration: {
          value: daily.daylight_duration[i] / 3600,
          unit: "h",
        },
        hourly: this.getHourlyData(i),
      });
    }

    return structuredDays;
  }

  private getHourlyData(dayIndex: number): HourlyWeatherData[] {
    const HOURS_PER_DAY = 24;
    const start = dayIndex * HOURS_PER_DAY;
    const end = start + HOURS_PER_DAY;
    const { hourly } = this.weatherData;
    const hourlyData: HourlyWeatherData[] = [];

    for (let i = start; i < end; i++) {
      hourlyData.push({
        hour: { value: hourly.time[i], unit: "iso8601" },
        temperature: { value: hourly.temperature_2m[i], unit: "ºC" },
        relativeHumidity: { value: hourly.relative_humidity_2m[i], unit: "%" },
        dewPoint: { value: hourly.dew_point_2m[i], unit: "ºC" },
        apparentTemperature: {
          value: hourly.apparent_temperature[i],
          unit: "ºC",
        },
        precipitationProbability: {
          value: hourly.precipitation_probability[i],
          unit: "%",
        },
        precipitation: { value: hourly.precipitation[i], unit: "mm" },
        rain: { value: hourly.rain[i], unit: "mm" },
        snowfall: { value: hourly.snowfall[i], unit: "cm" },
        snowDepth: { value: hourly.snow_depth[i], unit: "m" },
        weatherCode: { value: hourly.weather_code[i], unit: "wmo code" },
        weatherDescription: WMOWeatherTexts[hourly.weather_code[i]],
        pressureMsl: { value: hourly.pressure_msl[i], unit: "hPa" },
        cloudCover: { value: hourly.cloud_cover[i], unit: "%" },
        visibility: { value: hourly.visibility[i] / 1000, unit: "km" },
        wind: {
          direction: { value: hourly.wind_direction_10m[i], unit: "º" },
          speed: { value: hourly.wind_speed_10m[i], unit: "km/h" },
        },
        uv: {
          index: hourly.uv_index[i],
          riskLevels: getUvRiskLevel(hourly.uv_index[i]),
          description: uvDescriptions[getUvRiskLevel(hourly.uv_index[i])],
          unit: "",
        },
        isDay: { value: hourly.is_day[i], unit: "" },
      });
    }

    return hourlyData;
  }
}
