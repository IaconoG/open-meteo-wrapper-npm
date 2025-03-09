import {
  WeatherData,
  StructureWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
  Metric,
  NumericMetric,
  WeatherDescriptions,
  WindDataMetric,
  UVDataMetric,
} from "../types/weatherTypes";
import { UNITS, WMOWeatherTexts } from "../utils/constants";
import { getUvRiskLevel, getUvDescription } from "../utils/utils";

/**
 * Clase para analizar y estructurar los datos meteorológicos obtenidos de la API.
 */
export class WeatherDataParser {
  private weatherData: WeatherData;
  private pastDays: number;
  private forecastDays: number;

  /**
   * Constructor de la clase WeatherDataParser.
   * @param weatherData - Datos meteorológicos obtenidos de la API.
   * @param pastDays - Número de días pasados a incluir en los datos.
   * @param forecastDays - Número de días de pronóstico a incluir en los datos.
   */
  constructor(
    weatherData: WeatherData,
    pastDays: number,
    forecastDays: number,
  ) {
    this.weatherData = weatherData;
    this.pastDays = pastDays;
    this.forecastDays = forecastDays;
  }

  /**
   * Analiza y estructura los datos meteorológicos.
   * @returns Estructura de los datos meteorológicos organizados.
   */
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
      latitude: this.weatherData.latitude,
      longitude: this.weatherData.longitude,
    };
  }

  /**
   * Procesa los datos meteorológicos diarios.
   * @param startIndex - Índice de inicio para los datos diarios.
   * @param endIndex - Índice de fin para los datos diarios.
   * @returns Array de datos meteorológicos diarios.
   */
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

      const dataMap: Record<
        string,
        | Metric<Date | number, string>
        | NumericMetric<string>
        | WeatherDescriptions
        | HourlyWeatherData[]
      > = {
        day: { value: time?.[i], unit: UNITS.time },
        hourly: this.getHourlyData(i),
        temperatureMax: {
          value: temperature_2m_max?.[i] ?? 0,
          unit: UNITS.temperature_2m_max,
        },
        temperatureMin: {
          value: temperature_2m_min?.[i] ?? 0,
          unit: UNITS.temperature_2m_min,
        },
        sunrise: { value: sunrise?.[i] ?? new Date(), unit: UNITS.sunrise },
        sunset: { value: sunset?.[i] ?? new Date(), unit: UNITS.sunset },
        daylightDuration: {
          value: daylight_duration?.[i] ? daylight_duration[i] / 3600 : 0,
          unit: UNITS.daylight_duration,
        },
      };

      this.assignValues(dailyValues, dataMap);

      structuredDays.push(dailyValues);
    }
    return structuredDays;
  }

  /**
   * Obtiene los datos meteorológicos por hora para un día específico.
   * @param dayIndex - Índice del día para obtener los datos por hora.
   * @returns Array de datos meteorológicos por hora.
   */
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
      const hourlyValues: HourlyWeatherData = {};

      const dataMap: Record<
        string,
        | Metric<Date | number, string>
        | NumericMetric<string>
        | WeatherDescriptions
        | WindDataMetric
        | UVDataMetric
      > = {
        hour: { value: time?.[i] ?? new Date(), unit: UNITS.time },
        temperature: {
          value: temperature_2m?.[i] ?? 0,
          unit: UNITS.temperature_2m,
        },
        weatherCode: {
          value: weather_code?.[i] ?? 0,
          unit: UNITS.weather_code,
        },
        weatherDescription: WMOWeatherTexts[weather_code?.[i] ?? 0],
        relativeHumidity: {
          value: relative_humidity_2m?.[i] ?? 0,
          unit: UNITS.relative_humidity_2m,
        },
        dewPoint: { value: dew_point_2m?.[i] ?? 0, unit: UNITS.dew_point_2m },
        apparentTemperature: {
          value: apparent_temperature?.[i] ?? 0,
          unit: UNITS.apparent_temperature,
        },
        precipitationProbability: {
          value: precipitation_probability?.[i] ?? 0,
          unit: UNITS.precipitation_probability,
        },
        precipitation: {
          value: precipitation?.[i] ?? 0,
          unit: UNITS.precipitation,
        },
        rain: { value: rain?.[i] ?? 0, unit: UNITS.rain },
        snowfall: { value: snowfall?.[i] ?? 0, unit: UNITS.snowfall },
        snowDepth: { value: snow_depth?.[i] ?? 0, unit: UNITS.snow_depth },
        pressureMsl: {
          value: pressure_msl?.[i] ?? 0,
          unit: UNITS.pressure_msl,
        },
        cloudCover: { value: cloud_cover?.[i] ?? 0, unit: UNITS.cloud_cover },
        visibility: {
          value: visibility?.[i] ? visibility[i] / 1000 : 0,
          unit: UNITS.visibility,
        },
        uv: {
          value: uv_index?.[i] ?? 0,
          unit: "",
          riskLevels: getUvRiskLevel(uv_index?.[i] ?? 0),
          description: getUvDescription(uv_index?.[i] ?? 0),
        },
        wind: {
          direction: {
            value: wind_direction_10m?.[i] ?? 0,
            unit: UNITS.wind_direction_10m,
          },
          speed: {
            value: wind_speed_10m?.[i] ?? 0,
            unit: UNITS.wind_speed_10m,
          },
        },
        isDay: { value: is_day?.[i] ?? 0, unit: "" },
      };

      this.assignValues(hourlyValues, dataMap);

      hourlyData.push(hourlyValues);
    }
    return hourlyData;
  }

  /**
   * Asigna valores del dataMap al objeto target.
   * @param target - Objeto destino donde se asignarán los valores.
   * @param dataMap - Mapa de datos con las claves y valores a asignar.
   */
  private assignValues(
    target: Partial<DailyWeatherData> | HourlyWeatherData,
    dataMap: Record<
      string,
      | Metric<Date | number, string>
      | NumericMetric<string>
      | WeatherDescriptions
      | HourlyWeatherData[]
      | WindDataMetric
      | UVDataMetric
    >,
  ) {
    Object.keys(dataMap).forEach((key) => {
      const value = dataMap[key];
      if (
        key === "wind" &&
        value &&
        (value as WindDataMetric).direction?.value !== undefined
      ) {
        (target as HourlyWeatherData)[key] = value as WindDataMetric;
      } else if (key == "weatherDescription" && value !== undefined) {
        (target as HourlyWeatherData)[key] = value as WeatherDescriptions;
      } else if (
        value &&
        (value as Metric<Date | number, string>).value !== undefined
      ) {
        (target as any)[key] = value;
      }
    });
  }
}
