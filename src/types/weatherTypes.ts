// Tipos de mensajes de la API
export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

// Tipos de errores de la API
export enum ErrorType {
  NETWORK_ERROR = "network_error",
  API_ERROR = "api_error",
  DATA_ERROR = "data_error",
  UNKNOWN_ERROR = "unknown_error",
}

// Estructura de un error de la API
export interface FetchError {
  error: string;
  status?: number;
  type: MessageType;
  errorType: ErrorType;
  info?: string;
}

// Parámetros meteorológicos disponibles en datos por hora
export enum HourlyParams {
  Temperature = "temperature_2m", // En grados Celsius ºC
  RelativeHumidity = "relative_humidity_2m", // En porcentaje %
  DewPoint = "dew_point_2m", // En grados Celsius ºC (Punto rocio)
  ApparentTemperature = "apparent_temperature", // En grados Celsius ºC (Sensación térmica)
  PrecipitationProbability = "precipitation_probability", // En porcentaje %
  Precipitation = "precipitation", // En milímetros mm
  Rain = "rain", // En milímetros mm
  Snowfall = "snowfall", // En milímetros cm
  SnowDepth = "snow_depth", // En metros m
  WeatherCode = "weather_code", // En código WMO
  PressureMsl = "pressure_msl", // En hectopascales hPa
  CloudCover = "cloud_cover", // En porcentaje %
  Visibility = "visibility", // En metros m
  WindSpeed = "wind_speed_10m", // En kilometros por hora km/h
  WindDirection = "wind_direction_10m", // En grados
  UvIndex = "uv_index", // Índice UV
  IsDay = "is_day", // Indica si es de día o de noche (1: día, 0: noche)
}

// Parámetros meteorológicos disponibles en datos diarios
export enum DailyParams {
  TemperatureMax = "temperature_2m_max",
  TemperatureMin = "temperature_2m_min",
  Sunrise = "sunrise",
  Sunset = "sunset",
  DaylightDuration = "daylight_duration",
}

// Propiedades necesarias para realizar una solicitud de datos meteorológicos
export interface FetchWeatherProps {
  latitude: number;
  longitude: number;
  hourly?: HourlyParams[];
  daily?: DailyParams[];
  timezone?: string;
  past_days?: number;
  forecast_days?: number;
}

// Estructura de los datos meteorológicos obtenidos de la API
export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  current?: { time: Date };
  hourly: {
    time: Date[];
    temperature_2m: number[];
    weather_code: number[];
  } & Partial<
    Record<
      Exclude<
        HourlyParams,
        HourlyParams.Temperature | HourlyParams.WeatherCode
      >,
      number[]
    >
  >;
  daily: {
    time: Date[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise?: Date[];
    sunset?: Date[];
    daylight_duration?: number[];
  };
}

// Estructura global con datos meteorológicos organizados
export interface StructureWeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  pastDay: DailyWeatherData[];
  currentDay: DailyWeatherData;
  forecast: DailyWeatherData[];
}

// Tipos simplificados para valores meteorológicos
export interface WeatherValue {
  value: number;
  unit: string;
}

export interface DateValue {
  value: Date;
  unit: string;
}

export interface TextValue {
  value: string;
  unit: string;
}

// Datos del viento simplificados
export interface WindData {
  speed: WeatherValue;
  direction?: WeatherValue;
}

// Datos del índice UV simplificados
export interface UVData {
  value: number;
  riskLevel: UvRiskLevels;
  description: string;
  unit: string;
}

// Representa la información meteorológica de un día específico
export interface DailyWeatherData {
  day?: DateValue;
  hourly?: HourlyWeatherData[];
  temperatureMax?: WeatherValue;
  temperatureMin?: WeatherValue;
  sunrise?: DateValue;
  sunset?: DateValue;
  daylightDuration?: WeatherValue;
}

// Representa la información meteorológica por hora
export interface HourlyWeatherData {
  hour?: DateValue;
  temperature?: WeatherValue;
  relativeHumidity?: WeatherValue;
  dewPoint?: WeatherValue;
  apparentTemperature?: WeatherValue;
  precipitationProbability?: WeatherValue;
  precipitation?: WeatherValue;
  rain?: WeatherValue;
  snowfall?: WeatherValue;
  snowDepth?: WeatherValue;
  weatherCode?: WeatherValue;
  weatherDescription?: TextValue;
  pressureMsl?: WeatherValue;
  cloudCover?: WeatherValue;
  visibility?: WeatherValue;
  wind?: WindData;
  uv?: UVData;
  isDay?: WeatherValue;
}

// Niveles de riesgo del índice UV
export enum UvRiskLevels {
  UNKNOWN = "Desconocido",
  LOW = "Bajo",
  MODERATE = "Moderado",
  HIGH = "Alto",
}

/** Relación entre códigos WMO y su descripción meteorológica correspondiente.
 * WMO Weather interpretation codes (WW)
 * 0	Clear sky
 * 1, 2, 3	Mainly clear, partly cloudy, and overcast
 * 45, 48	Fog and depositing rime fog
 * 51, 53, 55	Drizzle: Light, moderate, and dense intensity
 * 56, 57	Freezing Drizzle: Light and dense intensity
 * 61, 63, 65	Rain: Slight, moderate and heavy intensity
 * 66, 67	Freezing Rain: Light and heavy intensity
 * 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
 * 77	Snow grains
 * 80, 81, 82	Rain showers: Slight, moderate, and violent
 * 85, 86	Snow showers slight and heavy
 * 95	Thunderstorm: Slight or moderate
 */
export enum WeatherDescriptions {
  clear_sky = "Cielo despejado",
  mainly_clear = "Mayormente despejado",
  partly_cloudy = "Parcialmente nublado",
  overcast = "Mayormente nublado",
  fog = "Niebla",
  depositing_rime_fog = "Niebla con escarcha",
  drizzle_light = "Llovizna ligera",
  drizzle_moderate = "Llovizna moderada",
  drizzle_dense = "Llovizna densa",
  freezing_drizzle_light = "Llovizna helada ligera",
  freezing_drizzle_dense = "Llovizna helada densa",
  rain_slight = "Lluvia ligera",
  rain_moderate = "Lluvia moderada",
  rain_heavy = "Lluvia intensa",
  freezing_rain_light = "Lluvia helada ligera",
  freezing_rain_heavy = "Lluvia helada intensa",
  snowfall_slight = "Nevada ligera",
  snowfall_moderate = "Nevada moderada",
  snowfall_heavy = "Nevada intensa",
  snow_grains = "Precipitación de granos de nieve",
  rain_showers_slight = "Chubascos ligeros",
  rain_showers_moderate = "Chubascos moderados",
  rain_showers_violent = "Chubascos violentos",
  snow_showers_slight = "Chubascos de nieve ligeros",
  snow_showers_heavy = "Chubascos de nieve intensos",
  thunderstorm = "Tormenta",
}
