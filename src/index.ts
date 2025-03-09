/**
 * @module hooks/useWeather
 * Este módulo contiene el hook personalizado `useWeather` que permite obtener datos meteorológicos.
 */
export { useWeather } from "../src/hooks/useWeather";

/**
 * @module services/weatherService
 * Este módulo contiene la función `fetchWeather` que permite obtener datos meteorológicos.
 */
export { fetchWeather } from "../src/services/weatherService";

/**
 * @module types/weatherTypes
 * Este módulo contiene las propiedades necesarias para realizar una solicitud de datos
 * meteorológicos.
 */
export type {
  FetchError,
  FetchWeatherProps,
  StructureWeatherData,
  DailyWeatherData,
  HourlyWeatherData,
} from "../src/types/weatherTypes";

/**
 * @module types/weatherTypes
 * Estructura de los datos meteorológicos obtenidos de la API.
 */
export {
  ErrorType,
  HourlyParams,
  DailyParams,
  WeatherDescriptions,
  UvRiskLevels,
} from "../src/types/weatherTypes";
