/**
 * Servicio principal para obtener y estructurar datos meteorológicos desde la API de Open-Meteo.
 * Incluye manejo de errores y transformación de datos crudos mediante WeatherDataParser.
 */

import { WEATHER_CONSTANTS } from "../utils/constants";
import {
  FetchWeatherProps,
  StructureWeatherData,
  FetchError,
  WeatherQueryMode,
} from "../types/weatherTypes";
import { OpenMeteoClient, IWeatherApiClient } from "./api/OpenMeteoClient";
import { OpenMeteoAdapter, IWeatherAdapter } from "./adapters/OpenMeteoAdapter";
import { WeatherData } from "@/types/apiTypes";

/**
 * Realiza una solicitud a la API de Open-Meteo para obtener datos meteorológicos.
 * Devuelve los datos organizados mediante WeatherDataParser o un error estructurado.
 *
 * Flujo principal:
 * 1. Construye la URL y realiza la solicitud a la API.
 * 2. Si la respuesta es exitosa, transforma los datos crudos con WeatherDataParser.
 * 3. Si hay error, retorna un objeto FetchError estandarizado.
 * 4. Maneja timeout y errores inesperados.
 *
 * @param {FetchWeatherProps} params Parámetros de la consulta meteorológica
 * @returns {Promise<StructureWeatherData | FetchError>} Datos meteorológicos organizados o error
 */
export const fetchWeather = async (
  params: FetchWeatherProps,
  options?: { client?: IWeatherApiClient; adapter?: IWeatherAdapter },
): Promise<StructureWeatherData | FetchError> => {
  const {
    latitude,
    longitude,
    hourly = WEATHER_CONSTANTS.DEFAULT_HOURLY_PARAMS,
    daily = WEATHER_CONSTANTS.DEFAULT_DAILY_PARAMS,
    current = WEATHER_CONSTANTS.DEFAULT_CURRENT_PARAMS,
    timezone = WEATHER_CONSTANTS.DEFAULT_TIMEZONE,
    mode = WeatherQueryMode.ForecastLength,
    past_days = WEATHER_CONSTANTS.DEFAULT_PAST_DAYS,
    forecast_days = WEATHER_CONSTANTS.DEFAULT_FORECAST_DAYS,
    start_date,
    end_date,
  } = params;

  const clientToUse = options?.client || new OpenMeteoClient();
  const adapterToUse = options?.adapter || new OpenMeteoAdapter();

  const raw =
    mode === WeatherQueryMode.TimeInterval
      ? await clientToUse.fetchRaw({
          latitude,
          longitude,
          hourly,
          daily,
          current,
          timezone,
          mode,
          start_date: start_date!,
          end_date: end_date!,
        })
      : await clientToUse.fetchRaw({
          latitude,
          longitude,
          hourly,
          daily,
          current,
          timezone,
          mode,
          past_days,
          forecast_days,
        });

  if ("error" in (raw as FetchError)) {
    return raw as FetchError;
  }

  const adapted = adapterToUse.adapt(raw as WeatherData, params);
  return adapted;
};
