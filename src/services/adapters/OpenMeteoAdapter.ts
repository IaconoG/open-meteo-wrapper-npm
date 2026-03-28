import { WeatherData } from "../../types/apiTypes";
import {
  StructureWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
} from "../../types/weatherTypes";
import { UNITS, WMO_WEATHER_CODES } from "../../utils/constants";
import { getUvRiskLevel, getUvDescription } from "../../utils/utils";

export interface IWeatherAdapter {
  adapt(
    raw: WeatherData,
    pastDays: number,
    forecastDays: number,
  ): StructureWeatherData;
}

export class OpenMeteoAdapter implements IWeatherAdapter {
  adapt(
    raw: WeatherData,
    pastDays: number,
    forecastDays: number,
  ): StructureWeatherData {
    // Reimplementación de la lógica de WeatherDataParser pero como funciones puras
    const currentDayIndex = pastDays;
    const forecastDayStartIndex = currentDayIndex + 1;
    const totalDays = pastDays + forecastDays + 1;

    const processedData = this.processWeatherData(
      raw,
      currentDayIndex,
      forecastDayStartIndex,
    );
    const currentDay =
      processedData.length > 0 ? processedData[0] : ({} as DailyWeatherData);

    return {
      pastDay: this.processWeatherData(raw, 0, currentDayIndex),
      currentDay,
      forecast: this.processWeatherData(raw, forecastDayStartIndex, totalDays),
      timezone: raw.timezone,
      latitude: raw.latitude,
      longitude: raw.longitude,
    };
  }

  private processWeatherData(
    raw: WeatherData,
    startIndex: number,
    endIndex: number,
  ): DailyWeatherData[] {
    const { daily } = raw;
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
          value: daylight_duration[i] / 3600,
          unit: UNITS.daylight_duration,
        };
      }

      dailyData.hourly = this.getHourlyData(raw, i);

      structuredDays.push(dailyData);
    }

    return structuredDays;
  }

  private getHourlyData(
    raw: WeatherData,
    dayIndex: number,
  ): HourlyWeatherData[] {
    const { hourly, daily } = raw;
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

    const timeZone = raw.timezone || "UTC";

    // Si daily.time está en formato 'YYYY-MM-DD' (sin timezone), usar ese valor como la fecha local
    let dayYearLocal: number;
    let dayMonthLocal: number;
    let dayDayLocal: number;
    const dayTimeValue: string | Date = daily.time[dayIndex];
    if (
      typeof dayTimeValue === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(dayTimeValue)
    ) {
      const parts = dayTimeValue.split("-").map(Number);
      dayYearLocal = parts[0];
      dayMonthLocal = parts[1] - 1;
      dayDayLocal = parts[2];
    } else {
      const dayDate = new Date(dayTimeValue);
      dayYearLocal = Number(
        dayDate.toLocaleString("en", { timeZone, year: "numeric" }),
      );
      dayMonthLocal =
        Number(dayDate.toLocaleString("en", { timeZone, month: "numeric" })) -
        1;
      dayDayLocal = Number(
        dayDate.toLocaleString("en", { timeZone, day: "numeric" }),
      );
    }

    const hourlyData: HourlyWeatherData[] = [];

    for (let hour = 0; hour < 24; hour++) {
      let foundIndex = -1;
      for (let i = 0; i < time.length; i++) {
        const hourDate = new Date(time[i]);
        const hourYearLocal = Number(
          hourDate.toLocaleString("en", { timeZone, year: "numeric" }),
        );
        const hourMonthLocal =
          Number(
            hourDate.toLocaleString("en", { timeZone, month: "numeric" }),
          ) - 1;
        const hourDayLocal = Number(
          hourDate.toLocaleString("en", { timeZone, day: "numeric" }),
        );
        const hourHourLocal = Number(
          hourDate.toLocaleString("en", {
            timeZone,
            hour: "numeric",
            hour12: false,
          }),
        );

        if (
          hourYearLocal === dayYearLocal &&
          hourMonthLocal === dayMonthLocal &&
          hourDayLocal === dayDayLocal &&
          hourHourLocal === hour
        ) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
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
          hourData.rain = { value: rain[i], unit: UNITS.rain };
        }
        if (snowfall?.[i] !== undefined) {
          hourData.snowfall = { value: snowfall[i], unit: UNITS.snowfall };
        }
        if (snow_depth?.[i] !== undefined) {
          hourData.snowDepth = { value: snow_depth[i], unit: UNITS.snow_depth };
        }
        if (weather_code?.[i] !== undefined) {
          hourData.weatherCode = {
            value: weather_code[i],
            unit: UNITS.weather_code,
          };
          const description = WMO_WEATHER_CODES[weather_code[i]];
          if (description) {
            hourData.weatherDescription = { value: description, unit: "text" };
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
          hourData.isDay = { value: is_day[i], unit: UNITS.is_day };
        }
        hourlyData.push(hourData);
      } else {
        const missingHour = new Date(
          Date.UTC(dayYearLocal, dayMonthLocal, dayDayLocal, hour, 0, 0, 0),
        );
        hourlyData.push({ hour: { value: missingHour, unit: UNITS.hour } });
      }
    }

    return hourlyData;
  }
}
