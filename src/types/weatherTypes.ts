/**
 * Representa una ubicación geográfica con latitud y longitud.
 */
export interface Location {
  readonly lat: number;
  readonly lng: number;
}

//** API TYPES */

/**
 * Parámetros meteorológicos disponibles en datos por hora.
 */
export enum HourlyParams {
  time = "time", // En formato ISO8601
  Temperature2m = "temperature_2m", // En grados Celsius ºC
  RelativeHumidity2m = "relative_humidity_2m", // En porcentaje %
  DewPoint2m = "dew_point_2m", // En grados Celsius ºC (Punto rocio)
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
  WindSpeed10m = "wind_speed_10m", // En kilometros por hora km/h
  WindDirection10m = "wind_direction_10m", // En grados
  UvIndex = "uv_index", // Índice UV
  IsDay = "is_day", // Indica si es de día o de noche (1: día, 0: noche)
}

/**
 * Parámetros meteorológicos disponibles en datos diarios.
 */
export enum DailyParams {
  Temperature2mMax = "temperature_2m_max",
  Temperature2mMin = "temperature_2m_min",
  Sunrise = "sunrise",
  Sunset = "sunset",
  DaylightDuration = "daylight_duration",
}

/**
 * Propiedades necesarias para realizar una solicitud de datos meteorológicos.
 */
export interface FetchWeatherProps {
  latitude: number;
  longitude: number;
  hourly?: HourlyParams[];
  daily?: DailyParams[];
  timezone?: string;
  past_days?: number;
  forecast_days?: number;
}

//** MODELS */

/**
 * Estructura de los datos meteorológicos obtenidos de la API.
 */
export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: { time: Date };
  hourly: Record<HourlyParams, number[]> & { time: Date[] };
  daily: Record<DailyParams, number[]> & {
    time: Date[];
    sunrise: Date[];
    sunset: Date[];
  };
}

/**
 * Estructura global con datos meteorológicos organizados.
 */
export interface StructureWeatherData {
  pastDay: DailyWeatherData[];
  currentDay: DailyWeatherData;
  forecast: DailyWeatherData[];
  timezone: string;
}

/**
 * Representa el tipo base para los datos meteorológicos.
 */
export type Metric<T, U extends string = ""> = {
  value: T;
  unit: U;
};
export type NumericMetric<U extends string = ""> = Metric<number, U>;

export interface WindDataMetric {
  speed: NumericMetric<"km/h">;
  direction?: NumericMetric<"º">;
}

export interface UVDataMetric {
  index: number;
  riskLevels: string;
  description: string;
  unit: "";
}

/**
 * Representa la información meteorológica de un día específico.
 */
export interface DailyWeatherData {
  day?: {
    value: Date;
    unit: "iso8601";
  };
  hourly?: HourlyWeatherData[];
  temperatureMax?: NumericMetric<"ºC">;
  temperatureMin?: NumericMetric<"ºC">;
  sunrise?: Metric<Date, "iso8601">;
  sunset?: Metric<Date, "iso8601">;
  daylightDuration?: NumericMetric<"h">;
}

/**
 *
 */
export interface HourlyWeatherData {
  hour?: Metric<Date, "iso8601">;
  temperature?: NumericMetric<"ºC">;
  relativeHumidity?: NumericMetric<"%">;
  dewPoint?: NumericMetric<"ºC">;
  apparentTemperature?: NumericMetric<"ºC">;
  precipitationProbability?: NumericMetric<"%">;
  precipitation?: NumericMetric<"mm">;
  rain?: NumericMetric<"mm">;
  snowfall?: NumericMetric<"cm">;
  snowDepth?: NumericMetric<"m">;
  weatherCode?: NumericMetric<"wmo code">;
  weatherDescription?: WeatherDescriptions;
  pressureMsl?: NumericMetric<"hPa">;
  cloudCover?: NumericMetric<"%">;
  visibility?: NumericMetric<"km">;
  wind?: WindDataMetric;
  uv?: UVDataMetric;
  isDay?: NumericMetric<"">;
}

export enum UvRiskLevels {
  unknown = "Desconocido",
  low = "Bajo",
  moderate = "Moderado",
  high = "Alto",
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
  rain_showers_slight = "Chubascos  ligera",
  rain_showers_moderate = "Chubascos  moderada",
  rain_showers_violent = "Chubascos  Violentos",
  snow_showers_slight = "Chubascos de nieve ligera",
  snow_showers_heavy = "Chubascos de nieve intensa",
  thunderstorm = "Tormenta",
}
