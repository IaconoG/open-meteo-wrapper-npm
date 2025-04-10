/**
 * @module hooks/useWeather
 * Este módulo contiene el hook personalizado `useWeather` que permite obtener datos meteorológicos.
 */
export { useWeather } from "@/hooks/useWeather";

/**
 * @module services/weatherService
 * Este módulo contiene la función `fetchWeather` que permite obtener datos meteorológicos.
 */
export { fetchWeather } from "@/services/weatherService";

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
} from "@/types/weatherTypes";
