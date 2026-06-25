// Mantener enums y tipos de dominio
export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

// Modos de consulta soportados por la API
export enum WeatherQueryMode {
  ForecastLength = "forecast_length",
  TimeInterval = "time_interval",
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
  Showers = "showers", // En milímetros mm
  Snowfall = "snowfall", // En milímetros cm
  SnowDepth = "snow_depth", // En metros m
  WeatherCode = "weather_code", // En código WMO
  PressureMsl = "pressure_msl", // En hectopascales hPa
  SurfacePressure = "surface_pressure", // En hectopascales hPa
  CloudCover = "cloud_cover", // En porcentaje %
  Visibility = "visibility", // En metros m
  WindSpeed = "wind_speed_10m", // En kilometros por hora km/h
  WindDirection = "wind_direction_10m", // En grados
  WindGusts = "wind_gusts_10m", // En kilometros por hora km/h
  UvIndex = "uv_index", // Índice UV
  IsDay = "is_day", // Indica si es de día o de noche (1: día, 0: noche)
}

// Parámetros meteorológicos disponibles en datos diarios
export enum DailyParams {
  TemperatureMax = "temperature_2m_max",
  TemperatureMin = "temperature_2m_min",
  ApparentTemperatureMax = "apparent_temperature_max",
  ApparentTemperatureMin = "apparent_temperature_min",
  PrecipitationSum = "precipitation_sum",
  RainSum = "rain_sum",
  SnowfallSum = "snowfall_sum",
  PrecipitationHours = "precipitation_hours",
  WeatherCode = "weather_code",
  Sunrise = "sunrise",
  Sunset = "sunset",
  DaylightDuration = "daylight_duration",
  SunshineDuration = "sunshine_duration",
  WindSpeed10mMax = "wind_speed_10m_max",
  WindGusts10mMax = "wind_gusts_10m_max",
  WindDirection10mDominant = "wind_direction_10m_dominant",
  ShortwaveRadiationSum = "shortwave_radiation_sum",
  Et0ReferenceEvapotranspiration = "et0_reference_evapotranspiration",
  UvIndexMax = "uv_index_max",
  UvIndexClearSkyMax = "uv_index_clear_sky_max",
}

// Parámetros meteorológicos disponibles para current
export enum CurrentParams {
  WeatherCode = "weather_code",
  WindSpeed = "wind_speed_10m",
  WindDirection = "wind_direction_10m",
  WindGusts = "wind_gusts_10m",
  CloudCover = "cloud_cover",
  Temperature = "temperature_2m",
  RelativeHumidity = "relative_humidity_2m",
  ApparentTemperature = "apparent_temperature",
  IsDay = "is_day",
  Precipitation = "precipitation",
  Rain = "rain",
  Snowfall = "snowfall",
  Showers = "showers",
  SurfacePressure = "surface_pressure",
  PressureMsl = "pressure_msl",
}

// Propiedades necesarias para realizar una solicitud de datos meteorológicos
export interface BaseFetchWeatherProps {
  latitude: number;
  longitude: number;
  hourly?: HourlyParams[];
  daily?: DailyParams[];
  current?: CurrentParams[];
  timezone?: string;
}

export interface ForecastLengthFetchWeatherProps extends BaseFetchWeatherProps {
  mode?: WeatherQueryMode.ForecastLength;
  past_days?: number;
  forecast_days?: number;
  start_date?: never;
  end_date?: never;
}

export interface TimeIntervalFetchWeatherProps extends BaseFetchWeatherProps {
  mode: WeatherQueryMode.TimeInterval;
  start_date: string;
  end_date: string;
  past_days?: never;
  forecast_days?: never;
}

export type FetchWeatherProps =
  | ForecastLengthFetchWeatherProps
  | TimeIntervalFetchWeatherProps;

// Estructura global con datos meteorológicos organizados
export interface StructureWeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: CurrentWeatherData;
  pastDay: DailyWeatherData[];
  currentDay: DailyWeatherData;
  forecast: DailyWeatherData[];
}

// Notas: El tipo WeatherData (respuesta de la API) se ha movido a src/types/apiTypes.ts
// para separar los DTOs de la API y los tipos de dominio.

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
  apparentTemperatureMax?: WeatherValue;
  apparentTemperatureMin?: WeatherValue;
  precipitationSum?: WeatherValue;
  rainSum?: WeatherValue;
  snowfallSum?: WeatherValue;
  precipitationHours?: WeatherValue;
  weatherCode?: WeatherValue;
  weatherDescription?: TextValue;
  sunrise?: DateValue;
  sunset?: DateValue;
  daylightDuration?: WeatherValue;
  sunshineDuration?: WeatherValue;
  windSpeed10mMax?: WeatherValue;
  windGusts10mMax?: WeatherValue;
  windDirection10mDominant?: WeatherValue;
  shortwaveRadiationSum?: WeatherValue;
  et0ReferenceEvapotranspiration?: WeatherValue;
  uvIndexMax?: WeatherValue;
  uvIndexClearSkyMax?: WeatherValue;
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
  showers?: WeatherValue;
  snowfall?: WeatherValue;
  snowDepth?: WeatherValue;
  weatherCode?: WeatherValue;
  weatherDescription?: TextValue;
  pressureMsl?: WeatherValue;
  surfacePressure?: WeatherValue;
  cloudCover?: WeatherValue;
  visibility?: WeatherValue;
  wind?: WindData;
  windGusts?: WeatherValue;
  uv?: UVData;
  isDay?: WeatherValue;
}

// Datos del bloque current simplificados
export interface CurrentWeatherData {
  time?: DateValue;
  weatherCode?: WeatherValue;
  weatherDescription?: TextValue;
  windSpeed?: WeatherValue;
  windDirection?: WeatherValue;
  windGusts?: WeatherValue;
  cloudCover?: WeatherValue;
  temperature?: WeatherValue;
  relativeHumidity?: WeatherValue;
  apparentTemperature?: WeatherValue;
  isDay?: WeatherValue;
  precipitation?: WeatherValue;
  rain?: WeatherValue;
  snowfall?: WeatherValue;
  showers?: WeatherValue;
  surfacePressure?: WeatherValue;
  pressureMsl?: WeatherValue;
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
