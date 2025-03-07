import {
  WeatherData,
  StructureWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
} from "../types/weatherTypes";
import { UNITS, WMOWeatherTexts } from "../utils/constants";
import { getUvRiskLevel, getUvDescription } from "../utils/utils";

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
    const { daily } = this.weatherData;
    const structuredDays: DailyWeatherData[] = [];

    const {
      time,
      temperature_2m_max,
      temperature_2m_min,
      sunrise,
      sunset,
      daylight_duration,
    } = daily;

    for (let i = startIndex; i < endIndex; i++) {
      const dailyValues: Partial<DailyWeatherData> = {};

      const dataMap: { [key: string]: any } = {
        day: { value: time?.[i], unit: UNITS.time },
        hourly: this.getHourlyData(i),
        temperatureMax: {
          value: temperature_2m_max?.[i],
          unit: UNITS.temperature_2m_max,
        },
        temperatureMin: {
          value: temperature_2m_min?.[i],
          unit: UNITS.temperature_2m_min,
        },
        sunrise: { value: sunrise?.[i], unit: UNITS.sunrise },
        sunset: { value: sunset?.[i], unit: UNITS.sunset },
        daylightDuration: {
          value: daylight_duration?.[i]
            ? daylight_duration[i] / 3600
            : undefined,
          unit: UNITS.daylight_duration,
        },
      };

      Object.keys(dataMap).forEach((key) => {
        const value = dataMap[key];
        if (key === "hourly" && value && value.length)
          (dailyValues as any)[key] = value;
        else if (value && value.value !== undefined)
          (dailyValues as any)[key] = value;
      });

      structuredDays.push(dailyValues);
    }
    return structuredDays;
  }

  private getHourlyData(dayIndex: number): HourlyWeatherData[] {
    const HOURS_PER_DAY = 24;
    const start = dayIndex * HOURS_PER_DAY;
    const end = start + HOURS_PER_DAY;
    const { hourly } = this.weatherData;

    const {
      time,
      temperature_2m,
      relative_humidity_2m,
      dew_point_2m,
      apparent_temperature,
      precipitation_probability,
      precipitation,
      rain,
      snowfall,
      snow_depth,
      weather_code,
      pressure_msl,
      cloud_cover,
      visibility,
      wind_direction_10m,
      wind_speed_10m,
      uv_index,
      is_day,
    } = hourly;

    const hourlyData: HourlyWeatherData[] = [];

    for (let i = start; i < end; i++) {
      const hourlyValues: Partial<HourlyWeatherData> = {};

      const dataMap: { [key: string]: any } = {
        hour: { value: time?.[i], unit: UNITS.time },
        temperature: { value: temperature_2m?.[i], unit: UNITS.temperature_2m },
        weatherCode: { value: weather_code?.[i], unit: UNITS.weather_code },
        weatherDescription: WMOWeatherTexts[weather_code?.[i]],
        relativeHumidity: {
          value: relative_humidity_2m?.[i],
          unit: UNITS.relative_humidity_2m,
        },
        dewPoint: { value: dew_point_2m?.[i], unit: UNITS.dew_point_2m },
        apparentTemperature: {
          value: apparent_temperature?.[i],
          unit: UNITS.apparent_temperature,
        },
        precipitationProbability: {
          value: precipitation_probability?.[i],
          unit: UNITS.precipitation_probability,
        },
        precipitation: { value: precipitation?.[i], unit: UNITS.precipitation },
        rain: { value: rain?.[i], unit: UNITS.rain },
        snowfall: { value: snowfall?.[i], unit: UNITS.snowfall },
        snowDepth: { value: snow_depth?.[i], unit: UNITS.snow_depth },
        pressureMsl: { value: pressure_msl?.[i], unit: UNITS.pressure_msl },
        cloudCover: { value: cloud_cover?.[i], unit: UNITS.cloud_cover },
        visibility: {
          value: visibility?.[i] ? visibility[i] / 1000 : undefined,
          unit: UNITS.visibility,
        },
        uv: {
          value: uv_index?.[i],
          unit: "",
          riskLevels: getUvRiskLevel(uv_index?.[i] || 0),
          description: getUvDescription(uv_index?.[i] || 0),
        },
        wind: {
          direction: {
            value: wind_direction_10m?.[i],
            unit: UNITS.wind_direction_10m,
          },
          speed: { value: wind_speed_10m?.[i], unit: UNITS.wind_speed_10m },
        },
        isDay: { value: is_day?.[i], unit: "" },
      };

      Object.keys(dataMap).forEach((key) => {
        const value = dataMap[key];
        if (key === "wind" && value && value.direction.value !== undefined) {
          (hourlyValues as any)[key] = value;
        } else if (key == "weatherDescription" && value !== undefined) {
          (hourlyValues as any)[key] = value;
        } else if (value && value.value !== undefined) {
          (hourlyValues as any)[key] = value;
        }
      });

      hourlyData.push(hourlyValues);
    }
    return hourlyData;
  }
}
