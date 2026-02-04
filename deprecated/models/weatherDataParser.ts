// Deprecated: Este archivo se mantiene por compatibilidad/archivo histórico.
// Usa en su lugar `src/adapters/OpenMeteoAdapter.ts` que implementa el Adapter Pattern
// y proporciona la misma funcionalidad de transformación de la respuesta de Open-Meteo.
// No eliminar hasta validar la migración completa.

import { WeatherData } from "../src/types/apiTypes";
import { StructureWeatherData, DailyWeatherData, HourlyWeatherData } from "../src/types/weatherTypes";
import { UNITS, WMO_WEATHER_CODES } from "../src/utils/constants";
import { getUvRiskLevel, getUvDescription } from "../src/utils/utils";

/**
 * Clase encargada de analizar y estructurar los datos meteorológicos obtenidos de la API.
 * Convierte los datos crudos en estructuras tipadas y listas para usar en la aplicación.
 */
export class WeatherDataParser {
  private weatherData: WeatherData;
  private pastDays: number;
  private forecastDays: number;

  /**
   * Crea una instancia del parser de datos meteorológicos.
   * @param weatherData Datos meteorológicos crudos de la API
   * @param pastDays Número de días pasados incluidos
   * @param forecastDays Número de días de pronóstico incluidos
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
   * Analiza y estructura los datos meteorológicos en formato tipado y organizado.
   * @returns {StructureWeatherData} Datos meteorológicos organizados por día y hora
   */
  public parse(): StructureWeatherData {
    const currentDayIndex = this.pastDays;
    const forecastDayStartIndex = currentDayIndex + 1;
    const totalDays = this.pastDays + this.forecastDays + 1;

    const processedData = this.processWeatherData(
      currentDayIndex,
      forecastDayStartIndex,
    );
    const currentDay =
      processedData.length > 0 ? processedData[0] : ({} as DailyWeatherData);

    return {
      pastDay: this.processWeatherData(0, currentDayIndex),
      currentDay: currentDay,
      forecast: this.processWeatherData(forecastDayStartIndex, totalDays),
      timezone: this.weatherData.timezone,
      latitude: this.weatherData.latitude,
      longitude: this.weatherData.longitude,
    };
  }

  /**
   * Procesa los datos meteorológicos diarios y los convierte a tipos simplificados.
   * @param startIndex Índice de inicio en el array de días
   * @param endIndex Índice de fin (no inclusivo) en el array de días
   * @returns {DailyWeatherData[]} Array de datos diarios estructurados
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
      const dailyData: DailyWeatherData = {};

      // Asignar valores diarios con tipos simplificados
      if (time?.[i]) {
        dailyData.day = { value: new Date(time[i]), unit: UNITS.time };
      }

      if (temperature_2m_max?.[i] !== undefined) {
        dailyData.temperatureMax = {
          value: temperature_2m_max[i],
          unit: UNITS.temperature_2m_max,
        };
      }

      if (temperature_2m_min?.[i] !== undefined) {
        dailyData.temperatureMin = {
          value: temperature_2m_min[i],
          unit: UNITS.temperature_2m_min,
        };
      }

      if (sunrise?.[i]) {
        dailyData.sunrise = {
          value: new Date(sunrise[i]),
          unit: UNITS.sunrise,
        };
      }

      if (sunset?.[i]) {
        dailyData.sunset = { value: new Date(sunset[i]), unit: UNITS.sunset };
      }

      if (daylight_duration?.[i] !== undefined) {
        dailyData.daylightDuration = {
          value: daylight_duration[i] / 3600, // Convertir a horas
          unit: UNITS.daylight_duration,
        };
      }

      // Agregar datos horarios estructurados
      dailyData.hourly = this.getHourlyData(i);

      structuredDays.push(dailyData);
    }

    return structuredDays;
  }

  /**
   * Obtiene los datos meteorológicos por hora y los convierte a tipos simplificados.
   * @param dayIndex Índice del día para extraer las 24 horas correspondientes
   * @returns {HourlyWeatherData[]} Array de datos horarios estructurados
   */
  private getHourlyData(dayIndex: number): HourlyWeatherData[] {
    const { hourly, daily } = this.weatherData;
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

    // Obtener la fecha del día
    const dayDate = new Date(daily.time[dayIndex]);
    const dayYear = dayDate.getUTCFullYear();
    const dayMonth = dayDate.getUTCMonth();
    const dayDay = dayDate.getUTCDate();

    const hourlyData: HourlyWeatherData[] = [];

    // Para cada hora del día (0 a 23)
    for (let hour = 0; hour < 24; hour++) {
      // Buscar el índice en hourly.time que coincida con este día y hora
      let foundIndex = -1;
      for (let i = 0; i < time.length; i++) {
        const hourDate = new Date(time[i]);
        if (
          hourDate.getUTCFullYear() === dayYear &&
          hourDate.getUTCMonth() === dayMonth &&
          hourDate.getUTCDate() === dayDay &&
          hourDate.getUTCHours() === hour
        ) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
        // Hay datos para esta hora
        const i = foundIndex;
        const hourData: HourlyWeatherData = {};
        hourData.hour = { value: new Date(time[i]), unit: UNITS.hour };

        if (temperature_2m?.[i] !== undefined) {
          hourData.temperature = {
            value: temperature_2m[i],
            unit: UNITS.temperature_2m,
          };
        }
        if (relative_humidity_2m?.[i] !== undefined) {
          hourData.relativeHumidity = {
            value: relative_humidity_2m[i],
            unit: UNITS.relative_humidity_2m,
          };
        }
        if (dew_point_2m?.[i] !== undefined) {
          hourData.dewPoint = {
            value: dew_point_2m[i],
            unit: UNITS.dew_point_2m,
          };
        }
        if (apparent_temperature?.[i] !== undefined) {
          hourData.apparentTemperature = {
            value: apparent_temperature[i],
            unit: UNITS.apparent_temperature,
          };
        }
        if (precipitation_probability?.[i] !== undefined) {
          hourData.precipitationProbability = {
            value: precipitation_probability[i],
            unit: UNITS.precipitation_probability,
          };
        }
        if (precipitation?.[i] !== undefined) {
          hourData.precipitation = {
            value: precipitation[i],
            unit: UNITS.precipitation,
          };
        }
        if (rain?.[i] !== undefined) {
          hourData.rain = {
            value: rain[i],
            unit: UNITS.rain,
          };
        }
        if (snowfall?.[i] !== undefined) {
          hourData.snowfall = {
            value: snowfall[i],
            unit: UNITS.snowfall,
          };
        }
        if (snow_depth?.[i] !== undefined) {
          hourData.snowDepth = {
            value: snow_depth[i],
            unit: UNITS.snow_depth,
          };
        }
        if (weather_code?.[i] !== undefined) {
          hourData.weatherCode = {
            value: weather_code[i],
            unit: UNITS.weather_code,
          };
          const description = WMO_WEATHER_CODES[weather_code[i]];
          if (description) {
            hourData.weatherDescription = {
              value: description,
              unit: "text",
            };
          }
        }
        if (pressure_msl?.[i] !== undefined) {
          hourData.pressureMsl = {
            value: pressure_msl[i],
            unit: UNITS.pressure_msl,
          };
        }
        if (cloud_cover?.[i] !== undefined) {
          hourData.cloudCover = {
            value: cloud_cover[i],
            unit: UNITS.cloud_cover,
          };
        }
        if (visibility?.[i] !== undefined) {
          hourData.visibility = {
            value: visibility[i] / 1000,
            unit: UNITS.visibility,
          };
        }
        if (
          wind_speed_10m?.[i] !== undefined ||
          wind_direction_10m?.[i] !== undefined
        ) {
          hourData.wind = {
            speed: {
              value: wind_speed_10m?.[i] || 0,
              unit: UNITS.wind_speed_10m,
            },
          };
          if (wind_direction_10m?.[i] !== undefined) {
            hourData.wind.direction = {
              value: wind_direction_10m[i],
              unit: UNITS.wind_direction_10m,
            };
          }
        }
        if (uv_index?.[i] !== undefined) {
          const uvValue = uv_index[i];
          hourData.uv = {
            value: uvValue,
            riskLevel: getUvRiskLevel(uvValue),
            description: getUvDescription(uvValue),
            unit: "index",
          };
        }
        if (is_day?.[i] !== undefined) {
          hourData.isDay = {
            value: is_day[i],
            unit: UNITS.is_day,
          };
        }
        hourlyData.push(hourData);
      } else {
        // No hay datos para esta hora, solo agregar el objeto hour
        const missingHour = new Date(
          Date.UTC(dayYear, dayMonth, dayDay, hour, 0, 0, 0),
        );
        hourlyData.push({ hour: { value: missingHour, unit: UNITS.hour } });
      }
    }

    return hourlyData;
  }
}
