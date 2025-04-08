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
} from "@/_types/weatherTypes";
import { UNITS, WMOWeatherTexts } from "@/utils/constants";
import { getUvRiskLevel, getUvDescription } from "@/utils/utils";

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
        | { value: undefined; unit: string }
      > = {
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

      this.assignValues(dailyValues, dataMap);
      if (Object.keys(dailyValues).length > 0) structuredDays.push(dailyValues);
      break;
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
        | Metric<Date | number | WeatherDescriptions, string>
        | WeatherDescriptions
        | WindDataMetric
        | UVDataMetric
        | { value: undefined; unit: string }
      > = {
        hour: { value: time?.[i], unit: UNITS.time } as Metric<Date, "iso8601">,
        temperature: {
          value: temperature_2m?.[i],
          unit: UNITS.temperature_2m,
        } as NumericMetric<"ºC">,
        weatherCode: {
          value: weather_code?.[i],
          unit: UNITS.weather_code,
        } as NumericMetric<"wmo code">,
        weatherDescription: {
          value: WMOWeatherTexts[weather_code?.[i]],
          unit: "text",
        } as Metric<WeatherDescriptions, "text">,
        relativeHumidity: {
          value: relative_humidity_2m?.[i],
          unit: UNITS.relative_humidity_2m,
        } as NumericMetric<"%">,
        dewPoint: {
          value: dew_point_2m?.[i],
          unit: UNITS.dew_point_2m,
        } as NumericMetric<"ºC">,
        apparentTemperature: {
          value: apparent_temperature?.[i],
          unit: UNITS.apparent_temperature,
        } as NumericMetric<"ºC">,
        precipitationProbability: {
          value: precipitation_probability?.[i],
          unit: UNITS.precipitation_probability,
        } as NumericMetric<"%">,
        precipitation: {
          value: precipitation?.[i],
          unit: UNITS.precipitation,
        } as NumericMetric<"mm">,
        rain: { value: rain?.[i], unit: UNITS.rain } as NumericMetric<"mm">,
        snowfall: {
          value: snowfall?.[i],
          unit: UNITS.snowfall,
        } as NumericMetric<"cm">,
        snowDepth: {
          value: snow_depth?.[i],
          unit: UNITS.snow_depth,
        } as NumericMetric<"m">,
        pressureMsl: {
          value: pressure_msl?.[i],
          unit: UNITS.pressure_msl,
        } as NumericMetric<"hPa">,
        cloudCover: {
          value: cloud_cover?.[i],
          unit: UNITS.cloud_cover,
        } as NumericMetric<"%">,
        visibility: {
          value: visibility?.[i] ? visibility[i] / 1000 : undefined,
          unit: UNITS.visibility,
        } as NumericMetric<"km">,
        uv: {
          value: uv_index?.[i],
          unit: "text",
          riskLevel: getUvRiskLevel(uv_index?.[i] ?? 0),
          description: getUvDescription(uv_index?.[i] ?? 0),
        } as UVDataMetric,
        wind: {
          direction: {
            value: wind_direction_10m?.[i],
            unit: UNITS.wind_direction_10m,
          } as NumericMetric<"º">,
          speed: {
            value: wind_speed_10m?.[i],
            unit: UNITS.wind_speed_10m,
          } as NumericMetric<"km/h">,
        } as WindDataMetric,
        isDay: { value: is_day?.[i], unit: UNITS.is_day } as NumericMetric<"">,
      };
      this.assignValues(hourlyValues, dataMap);

      if (Object.keys(hourlyValues).length > 0) hourlyData.push(hourlyValues);
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
      | Metric<Date | number | WeatherDescriptions, string>
      | NumericMetric<string>
      | WeatherDescriptions
      | HourlyWeatherData[]
      | WindDataMetric
      | UVDataMetric
      | { value: undefined; unit: string }
    >,
  ) {
    Object.keys(dataMap).forEach((key) => {
      const value = dataMap[key];

      if (key in target) {
        if (isDailyWeatherData(target)) {
          (target as DailyWeatherData)[key as keyof DailyWeatherData] =
            value as any;
        } else if (isHourlyWeatherData(target)) {
          (target as HourlyWeatherData)[key as keyof HourlyWeatherData] =
            value as any;
        }
      }
    });
  }
}

// Funciones de refinamiento de tipos
function isDailyWeatherData(
  target: Partial<DailyWeatherData> | HourlyWeatherData,
): target is DailyWeatherData {
  return "temperatureMax" in target; // Propiedad específica de DailyWeatherData
}

function isHourlyWeatherData(
  target: Partial<DailyWeatherData> | HourlyWeatherData,
): target is HourlyWeatherData {
  return "temperature" in target; // Propiedad específica de HourlyWeatherData
}
