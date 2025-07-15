/**
 * @module hooks/useWeather
 * Este módulo contiene el hook personalizado `useWeather` que permite obtener datos meteorológicos.
 */
export { useWeather } from "./hooks/useWeather";

/**
 * @module store/useWeatherStore
 * Este módulo contiene el store de Zustand para gestionar el estado meteorológico.
 */
export { useWeatherStore } from "./store/useWeatherStore";

/**
 * @module services/weatherService
 * Este módulo contiene la función `fetchWeather` que permite obtener datos meteorológicos.
 */
export { fetchWeather } from "./services/weatherService";

/**
 * @module types/weatherTypes
 * Este módulo contiene las propiedades necesarias para realizar una solicitud de datos
 * meteorológicos.
 */
export type {
  FetchWeatherProps,
  DailyParams,
  HourlyParams,
  StructureWeatherData,
  FetchError,
  DailyWeatherData,
  HourlyWeatherData,
  WeatherValue,
  DateValue,
  TextValue,
  WindData,
  UVData,
  UvRiskLevels,
  WeatherDescriptions,
} from "./types/weatherTypes";
