import {
  DailyParams,
  HourlyParams,
  WeatherDescriptions,
} from "../types/weatherTypes";

/**
 * URL base para las solicitudes de datos meteorológicos.
 */
export const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Constantes de configuración para las solicitudes de datos meteorológicos.
 */
export const WEATHER_CONSTANTS = {
  DEFAULT_TIMEZONE: "America/Sao_Paulo", // Zona horaria por defecto
  DEFAULT_HOURLY_VALUE: ["temperature_2m", "weather_code"] as HourlyParams[], // Parámetros predeterminados por hora
  DEFAULT_DAILY_VALUE: [
    "temperature_2m_max",
    "temperature_2m_min",
  ] as DailyParams[], // Parámetros predeterminados por día
  DEFAULT_PAST_DAYS: 0, // Días pasados por defecto
  DEFAULT_FORECAST_DAYS: 7, // Días de pronóstico por defecto
} as const;

/* 
  https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index
    UV index    |         Action
  0 to 2        | You can safely enjoy being outside
  3 to 7        | Seek shade during midday hours. Slip on 
                | a shirt, slop on sunscreen and slap on a hat
  8 and above   | Avoid being outside during midday hours. 
                | Make sure you seek shade. Shirt, sunscreen and hat are a must  
*/
export const uvDescriptions: Record<string, string> = {
  unknown: "No se puede determinar el riesgo de exposición",
  low: "Puedes disfrutar de estar afuera con seguridad",
  moderate:
    "Busca sombra durante las horas del mediodía. Ponte una remera, utiliza protector solar y un sombrero.",
  high: "Evita estar afuera durante las horas del mediodía. Asegúrate de buscar sombra. La remera, el protector solar y el sombrero son imprescindibles.",
} as const;

/**
 * Descripciones de los códigos de tiempo WMO.
 */
export const WMOWeatherTexts: Record<number, WeatherDescriptions> = {
  0: WeatherDescriptions.clear_sky,
  1: WeatherDescriptions.mainly_clear,
  2: WeatherDescriptions.partly_cloudy,
  3: WeatherDescriptions.overcast,
  45: WeatherDescriptions.fog,
  48: WeatherDescriptions.depositing_rime_fog,
  51: WeatherDescriptions.drizzle_light,
  53: WeatherDescriptions.drizzle_moderate,
  55: WeatherDescriptions.drizzle_dense,
  56: WeatherDescriptions.freezing_drizzle_light,
  57: WeatherDescriptions.freezing_drizzle_dense,
  61: WeatherDescriptions.rain_slight,
  63: WeatherDescriptions.rain_moderate,
  65: WeatherDescriptions.rain_heavy,
  66: WeatherDescriptions.freezing_rain_light,
  67: WeatherDescriptions.freezing_rain_heavy,
  71: WeatherDescriptions.snowfall_slight,
  73: WeatherDescriptions.snowfall_moderate,
  75: WeatherDescriptions.snowfall_heavy,
  77: WeatherDescriptions.snow_grains,
  80: WeatherDescriptions.rain_showers_slight,
  81: WeatherDescriptions.rain_showers_moderate,
  82: WeatherDescriptions.rain_showers_violent,
  85: WeatherDescriptions.snow_showers_slight,
  86: WeatherDescriptions.snow_showers_heavy,
  95: WeatherDescriptions.thunderstorm,
} as const;
