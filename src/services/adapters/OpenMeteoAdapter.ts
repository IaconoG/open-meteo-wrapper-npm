import { WeatherData } from "../../types/apiTypes";
import {
  FetchWeatherProps,
  ForecastLengthFetchWeatherProps,
  CurrentWeatherData,
  StructureWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
  WeatherQueryMode,
} from "../../types/weatherTypes";
import { UNITS, WMO_WEATHER_CODES } from "../../utils/constants";
import { getUvRiskLevel, getUvDescription } from "../../utils/utils";

export interface IWeatherAdapter {
  adapt(raw: WeatherData, params: FetchWeatherProps): StructureWeatherData;
  adapt(
    raw: WeatherData,
    pastDays: number,
    forecastDays: number,
  ): StructureWeatherData;
}

export class OpenMeteoAdapter implements IWeatherAdapter {
  adapt(
    raw: WeatherData,
    paramsOrPastDays: FetchWeatherProps | number,
    forecastDaysArg?: number,
  ): StructureWeatherData {
    const params: FetchWeatherProps =
      typeof paramsOrPastDays === "number"
        ? ({
            mode: WeatherQueryMode.ForecastLength,
            past_days: paramsOrPastDays,
            forecast_days: forecastDaysArg ?? 0,
            latitude: raw.latitude,
            longitude: raw.longitude,
          } as ForecastLengthFetchWeatherProps)
        : paramsOrPastDays;

    const dailyCount = raw.daily.time?.length ?? 0;

    if (params.mode === WeatherQueryMode.TimeInterval) {
      const intervalDays = this.processWeatherData(raw, 0, dailyCount);

      return {
        current: this.getCurrentData(raw),
        pastDay: [],
        currentDay:
          intervalDays.length > 0 ? intervalDays[0] : ({} as DailyWeatherData),
        forecast: intervalDays.slice(1),
        timezone: raw.timezone,
        latitude: raw.latitude,
        longitude: raw.longitude,
      };
    }

    const pastDays = params.past_days ?? 0;
    const forecastDays = params.forecast_days ?? 0;
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
      current: this.getCurrentData(raw),
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
      apparent_temperature_max,
      apparent_temperature_min,
      precipitation_sum,
      rain_sum,
      snowfall_sum,
      precipitation_hours,
      weather_code,
      sunrise,
      sunset,
      daylight_duration,
      sunshine_duration,
      wind_speed_10m_max,
      wind_gusts_10m_max,
      wind_direction_10m_dominant,
      shortwave_radiation_sum,
      et0_reference_evapotranspiration,
      uv_index_max,
      uv_index_clear_sky_max,
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

      if (apparent_temperature_max?.[i] !== undefined) {
        dailyData.apparentTemperatureMax = {
          value: apparent_temperature_max[i],
          unit: UNITS.apparent_temperature_max,
        };
      }

      if (apparent_temperature_min?.[i] !== undefined) {
        dailyData.apparentTemperatureMin = {
          value: apparent_temperature_min[i],
          unit: UNITS.apparent_temperature_min,
        };
      }

      if (precipitation_sum?.[i] !== undefined) {
        dailyData.precipitationSum = {
          value: precipitation_sum[i],
          unit: UNITS.precipitation_sum,
        };
      }

      if (rain_sum?.[i] !== undefined) {
        dailyData.rainSum = { value: rain_sum[i], unit: UNITS.rain_sum };
      }

      if (snowfall_sum?.[i] !== undefined) {
        dailyData.snowfallSum = {
          value: snowfall_sum[i],
          unit: UNITS.snowfall_sum,
        };
      }

      if (precipitation_hours?.[i] !== undefined) {
        dailyData.precipitationHours = {
          value: precipitation_hours[i],
          unit: UNITS.precipitation_hours,
        };
      }

      if (weather_code?.[i] !== undefined) {
        dailyData.weatherCode = {
          value: weather_code[i],
          unit: UNITS.weather_code,
        };
        const description = WMO_WEATHER_CODES[weather_code[i]];
        if (description) {
          dailyData.weatherDescription = { value: description, unit: "text" };
        }
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

      if (sunshine_duration?.[i] !== undefined) {
        dailyData.sunshineDuration = {
          value: sunshine_duration[i] / 3600,
          unit: UNITS.sunshine_duration,
        };
      }

      if (wind_speed_10m_max?.[i] !== undefined) {
        dailyData.windSpeed10mMax = {
          value: wind_speed_10m_max[i],
          unit: UNITS.wind_speed_10m_max,
        };
      }

      if (wind_gusts_10m_max?.[i] !== undefined) {
        dailyData.windGusts10mMax = {
          value: wind_gusts_10m_max[i],
          unit: UNITS.wind_gusts_10m_max,
        };
      }

      if (wind_direction_10m_dominant?.[i] !== undefined) {
        dailyData.windDirection10mDominant = {
          value: wind_direction_10m_dominant[i],
          unit: UNITS.wind_direction_10m_dominant,
        };
      }

      if (shortwave_radiation_sum?.[i] !== undefined) {
        dailyData.shortwaveRadiationSum = {
          value: shortwave_radiation_sum[i],
          unit: UNITS.shortwave_radiation_sum,
        };
      }

      if (et0_reference_evapotranspiration?.[i] !== undefined) {
        dailyData.et0ReferenceEvapotranspiration = {
          value: et0_reference_evapotranspiration[i],
          unit: UNITS.et0_reference_evapotranspiration,
        };
      }

      if (uv_index_max?.[i] !== undefined) {
        dailyData.uvIndexMax = {
          value: uv_index_max[i],
          unit: UNITS.uv_index_max,
        };
      }

      if (uv_index_clear_sky_max?.[i] !== undefined) {
        dailyData.uvIndexClearSkyMax = {
          value: uv_index_clear_sky_max[i],
          unit: UNITS.uv_index_clear_sky_max,
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
      showers,
      snowfall,
      snow_depth,
      weather_code,
      pressure_msl,
      surface_pressure,
      cloud_cover,
      visibility,
      wind_direction_10m,
      wind_speed_10m,
      wind_gusts_10m,
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
        if (showers?.[i] !== undefined) {
          hourData.showers = { value: showers[i], unit: UNITS.showers };
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
        if (surface_pressure?.[i] !== undefined) {
          hourData.surfacePressure = {
            value: surface_pressure[i],
            unit: UNITS.surface_pressure,
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
        if (wind_gusts_10m?.[i] !== undefined) {
          hourData.windGusts = {
            value: wind_gusts_10m[i],
            unit: UNITS.wind_gusts_10m,
          };
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

  private getCurrentData(raw: WeatherData): CurrentWeatherData | undefined {
    const current = raw.current;
    if (!current) {
      return undefined;
    }

    const currentData: CurrentWeatherData = {};

    if (current.time) {
      currentData.time = { value: new Date(current.time), unit: UNITS.time };
    }

    if (current.weather_code !== undefined) {
      currentData.weatherCode = {
        value: current.weather_code,
        unit: UNITS.weather_code,
      };
      const description = WMO_WEATHER_CODES[current.weather_code];
      if (description) {
        currentData.weatherDescription = { value: description, unit: "text" };
      }
    }

    if (current.wind_speed_10m !== undefined) {
      currentData.windSpeed = {
        value: current.wind_speed_10m,
        unit: UNITS.wind_speed_10m,
      };
    }

    if (current.wind_direction_10m !== undefined) {
      currentData.windDirection = {
        value: current.wind_direction_10m,
        unit: UNITS.wind_direction_10m,
      };
    }

    if (current.wind_gusts_10m !== undefined) {
      currentData.windGusts = {
        value: current.wind_gusts_10m,
        unit: UNITS.wind_gusts_10m,
      };
    }

    if (current.cloud_cover !== undefined) {
      currentData.cloudCover = {
        value: current.cloud_cover,
        unit: UNITS.cloud_cover,
      };
    }

    if (current.temperature_2m !== undefined) {
      currentData.temperature = {
        value: current.temperature_2m,
        unit: UNITS.temperature_2m,
      };
    }

    if (current.relative_humidity_2m !== undefined) {
      currentData.relativeHumidity = {
        value: current.relative_humidity_2m,
        unit: UNITS.relative_humidity_2m,
      };
    }

    if (current.apparent_temperature !== undefined) {
      currentData.apparentTemperature = {
        value: current.apparent_temperature,
        unit: UNITS.apparent_temperature,
      };
    }

    if (current.is_day !== undefined) {
      currentData.isDay = { value: current.is_day, unit: UNITS.is_day };
    }

    if (current.precipitation !== undefined) {
      currentData.precipitation = {
        value: current.precipitation,
        unit: UNITS.precipitation,
      };
    }

    if (current.rain !== undefined) {
      currentData.rain = { value: current.rain, unit: UNITS.rain };
    }

    if (current.snowfall !== undefined) {
      currentData.snowfall = { value: current.snowfall, unit: UNITS.snowfall };
    }

    if (current.showers !== undefined) {
      currentData.showers = { value: current.showers, unit: UNITS.showers };
    }

    if (current.surface_pressure !== undefined) {
      currentData.surfacePressure = {
        value: current.surface_pressure,
        unit: UNITS.surface_pressure,
      };
    }

    if (current.pressure_msl !== undefined) {
      currentData.pressureMsl = {
        value: current.pressure_msl,
        unit: UNITS.pressure_msl,
      };
    }

    return currentData;
  }
}
