// Tipos que representan la respuesta de la API Open-Meteo
import { HourlyParams } from "./weatherTypes";

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  current?: { time: Date };
  hourly: {
    time: (string | Date)[];
    temperature_2m: number[];
    weather_code: number[];
  } & Partial<
    Record<
      Exclude<HourlyParams, HourlyParams.Temperature | HourlyParams.WeatherCode>,
      number[]
    >
  >;
  daily: {
    time: (string | Date)[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise?: (string | Date)[];
    sunset?: (string | Date)[];
    daylight_duration?: number[];
  };
}
