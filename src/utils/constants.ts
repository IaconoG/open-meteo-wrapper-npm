import {
  CurrentParams,
  DailyParams,
  HourlyParams,
  WeatherDescriptions,
  UvRiskLevels,
} from "../types/weatherTypes";

/**
 * URL base para las solicitudes de datos meteorológicos de Open-Meteo API.
 */
export const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Configuración por defecto para las solicitudes meteorológicas.
 * Estos valores se usan cuando el usuario no especifica parámetros.
 */
export const WEATHER_CONSTANTS = {
  /** Zona horaria por defecto para las consultas */
  DEFAULT_TIMEZONE: "America/Sao_Paulo",
  /** Parámetros meteorológicos por hora solicitados por defecto */
  DEFAULT_HOURLY_PARAMS: [
    HourlyParams.Temperature,
    HourlyParams.WeatherCode,
  ] as HourlyParams[],

  /** Parámetros meteorológicos diarios solicitados por defecto */
  DEFAULT_DAILY_PARAMS: [
    DailyParams.TemperatureMax,
    DailyParams.TemperatureMin,
  ] as DailyParams[],

  /** Parámetros meteorológicos current solicitados por defecto */
  DEFAULT_CURRENT_PARAMS: [
    CurrentParams.WeatherCode,
    CurrentParams.Temperature,
    CurrentParams.RelativeHumidity,
    CurrentParams.ApparentTemperature,
  ] as CurrentParams[],

  /** Número de días pasados a incluir por defecto */
  DEFAULT_PAST_DAYS: 0,

  /** Número de días de pronóstico a incluir por defecto */
  DEFAULT_FORECAST_DAYS: 7,

  /** Duración del caché en milisegundos (10 minutos) */
  DEFAULT_CACHE_DURATION: 10 * 60 * 1000,

  /** Timeout para las solicitudes HTTP en milisegundos */
  REQUEST_TIMEOUT: 10000,
} as const;

/**
 * Configuración de niveles de riesgo UV según la OMS.
 * @see https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index
 */
export const UV_RISK_CONFIG = {
  /** Rangos de índice UV para cada nivel de riesgo */
  RANGES: {
    [UvRiskLevels.LOW]: { min: 0, max: 2 },
    [UvRiskLevels.MODERATE]: { min: 3, max: 7 },
    [UvRiskLevels.HIGH]: { min: 8, max: Number.MAX_SAFE_INTEGER },
  },

  /** Descripciones de recomendaciones por nivel de riesgo UV */
  DESCRIPTIONS: {
    [UvRiskLevels.UNKNOWN]: "No se puede determinar el riesgo de exposición",
    [UvRiskLevels.LOW]: "Puedes disfrutar de estar afuera con seguridad",
    [UvRiskLevels.MODERATE]:
      "Busca sombra durante las horas del mediodía. Ponte una remera, utiliza protector solar y un sombrero.",
    [UvRiskLevels.HIGH]:
      "Evita estar afuera durante las horas del mediodía. Asegúrate de buscar sombra. La remera, el protector solar y el sombrero son imprescindibles.",
  } as const,
} as const;

/**
 * Mapeo de códigos meteorológicos WMO a descripciones en español.
 * @see https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 */
export const WMO_WEATHER_CODES: Record<number, WeatherDescriptions> = {
  // Cielo despejado y parcialmente nublado
  0: WeatherDescriptions.clear_sky,
  1: WeatherDescriptions.mainly_clear,
  2: WeatherDescriptions.partly_cloudy,
  3: WeatherDescriptions.overcast,

  // Niebla
  45: WeatherDescriptions.fog,
  48: WeatherDescriptions.depositing_rime_fog,

  // Llovizna
  51: WeatherDescriptions.drizzle_light,
  53: WeatherDescriptions.drizzle_moderate,
  55: WeatherDescriptions.drizzle_dense,
  56: WeatherDescriptions.freezing_drizzle_light,
  57: WeatherDescriptions.freezing_drizzle_dense,

  // Lluvia
  61: WeatherDescriptions.rain_slight,
  63: WeatherDescriptions.rain_moderate,
  65: WeatherDescriptions.rain_heavy,
  66: WeatherDescriptions.freezing_rain_light,
  67: WeatherDescriptions.freezing_rain_heavy,

  // Nieve
  71: WeatherDescriptions.snowfall_slight,
  73: WeatherDescriptions.snowfall_moderate,
  75: WeatherDescriptions.snowfall_heavy,
  77: WeatherDescriptions.snow_grains,

  // Chubascos
  80: WeatherDescriptions.rain_showers_slight,
  81: WeatherDescriptions.rain_showers_moderate,
  82: WeatherDescriptions.rain_showers_violent,
  85: WeatherDescriptions.snow_showers_slight,
  86: WeatherDescriptions.snow_showers_heavy,

  // Tormentas
  95: WeatherDescriptions.thunderstorm,
} as const;

/**
 * Mapeo de parámetros meteorológicos a sus unidades correspondientes.
 */
export const UNITS = {
  // Tiempo
  time: "iso8601",
  hour: "iso8601",

  // Temperatura
  temperature_2m: "ºC",
  temperature_2m_max: "ºC",
  temperature_2m_min: "ºC",
  apparent_temperature_max: "ºC",
  apparent_temperature_min: "ºC",
  dew_point_2m: "ºC",
  apparent_temperature: "ºC",

  // Humedad y precipitación
  relative_humidity_2m: "%",
  precipitation_probability: "%",
  precipitation: "mm",
  rain: "mm",
  snowfall: "cm",
  snow_depth: "m",
  precipitation_sum: "mm",
  rain_sum: "mm",
  snowfall_sum: "cm",
  precipitation_hours: "h",

  // Presión y viento
  pressure_msl: "hPa",
  wind_speed_10m: "km/h",
  wind_direction_10m: "°",
  wind_gusts_10m: "km/h",
  wind_speed_10m_max: "km/h",
  wind_gusts_10m_max: "km/h",
  wind_direction_10m_dominant: "°",
  surface_pressure: "hPa",

  // Cielo y visibilidad
  cloud_cover: "%",
  visibility: "km",
  weather_code: "wmo code",
  showers: "mm",

  // Sol y UV
  sunrise: "iso8601",
  sunset: "iso8601",
  daylight_duration: "h",
  sunshine_duration: "h",
  shortwave_radiation_sum: "MJ/m²",
  et0_reference_evapotranspiration: "mm",
  uv_index_max: "index",
  uv_index_clear_sky_max: "index",
  uv_index: "index",
  is_day: "flag",
} as const;
