// Tipos que representan la respuesta de la API Open-Meteo
import { CurrentParams, DailyParams, HourlyParams } from "./weatherTypes";

export type CurrentWeatherData = {
  time: string | Date;
} & Partial<Record<CurrentParams, number>>;

export type HourlyWeatherApiData = {
  time: (string | Date)[];
  temperature_2m: number[];
  weather_code: number[];
} & Partial<
  Record<
    Exclude<HourlyParams, HourlyParams.Temperature | HourlyParams.WeatherCode>,
    number[]
  >
>;

export type DailyWeatherApiData = {
  time: (string | Date)[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise?: (string | Date)[];
  sunset?: (string | Date)[];
} & Partial<
  Record<
    Exclude<
      DailyParams,
      | DailyParams.TemperatureMax
      | DailyParams.TemperatureMin
      | DailyParams.Sunrise
      | DailyParams.Sunset
    >,
    number[]
  >
>;

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  current?: CurrentWeatherData;
  hourly: HourlyWeatherApiData;
  daily: DailyWeatherApiData;
}
