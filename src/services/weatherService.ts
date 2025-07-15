/**
 * Servicio principal para obtener y estructurar datos meteorológicos desde la API de Open-Meteo.
 * Incluye manejo de errores y transformación de datos crudos mediante WeatherDataParser.
 */

import { BASE_URL, WEATHER_CONSTANTS } from "../utils/constants";
import {
  FetchWeatherProps,
  WeatherData,
  StructureWeatherData,
  FetchError,
  ErrorType,
  MessageType,
} from "../types/weatherTypes";
import { WeatherDataParser } from "../models/weatherDataParser";

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
export const fetchWeather = async ({
  latitude,
  longitude,
  hourly = WEATHER_CONSTANTS.DEFAULT_HOURLY_PARAMS,
  daily = WEATHER_CONSTANTS.DEFAULT_DAILY_PARAMS,
  timezone = WEATHER_CONSTANTS.DEFAULT_TIMEZONE,
  past_days = WEATHER_CONSTANTS.DEFAULT_PAST_DAYS,
  forecast_days = WEATHER_CONSTANTS.DEFAULT_FORECAST_DAYS,
}: FetchWeatherProps): Promise<StructureWeatherData | FetchError> => {
  try {
    // Construir la URL de la solicitud
    const url = new URL(BASE_URL);
    // Configurar los parámetros de la solicitud
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: hourly.join(","),
      daily: daily.join(","),
      timezone,
      past_days: past_days.toString(),
      forecast_days: forecast_days.toString(),
    });

    // Asignar los parámetros de búsqueda a la URL
    url.search = params.toString();

    // Crear un AbortController y un temporizador para cancelar la solicitud tras 10 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    // Realizar la solicitud a la API
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    // Limpiar el temporizador
    clearTimeout(timeout);

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      if (response.status >= 500) {
        return buildError({
          error: "Debido a un problema en el servidor, no podemos obtener la información del clima.",
          info: "Por favor, inténtalo de nuevo más tarde.",
          status: response.status,
          errorType: ErrorType.API_ERROR,
        });
      } else if (response.status >= 400) {
        if (response.status === 408) {
          return buildError({
            error: "La solicitud ha tardado demasiado tiempo en completarse.",
            status: 408,
            info: "Revisa tu conexión a internet e intenta de nuevo.",
            type: MessageType.WARNING,
            errorType: ErrorType.NETWORK_ERROR,
          });
        } else {
          return buildError({
            error: "No pudimos obtener la información del clima.",
            info: "Verifica que la ubicación ingresada sea correcta e inténtalo de nuevo.",
            status: response.status,
            type: MessageType.WARNING,
            errorType: ErrorType.API_ERROR,
          });
        }
      } else {
        return buildError({
          error: "Ocurrió un error al obtener los datos del clima.",
          status: response.status,
          errorType: ErrorType.UNKNOWN_ERROR,
        });
      }
    }

    // Parsear la respuesta y transformar los datos
    const data: WeatherData = await response.json();
    const weatherData = new WeatherDataParser(data, past_days, forecast_days);
    return weatherData.parse();
  } catch (error) {
    // Manejo de error por timeout
    if (error instanceof DOMException && error.name === "AbortError") {
      return buildError({
        error: "La solicitud ha tardado demasiado tiempo en completarse.",
        status: 408,
        info: "Revisa tu conexión a internet e intenta de nuevo.",
        type: MessageType.WARNING,
        errorType: ErrorType.NETWORK_ERROR,
      });
    }

    // Manejo de error inesperado
    return buildError({
      error: "Ocurrió un error inesperado al obtener los datos meteorológicos.",
      type: MessageType.ERROR,
      status: 0,
      errorType: ErrorType.UNKNOWN_ERROR,
    });
  }
};

/**
 * Utilidad interna para construir objetos FetchError de forma estandarizada.
 */
function buildError({ error, info, status, type, errorType }: Partial<FetchError>): FetchError {
  return {
    error: error || "Error desconocido.",
    info,
    status: status || 0,
    type: type || MessageType.ERROR,
    errorType: errorType || ErrorType.UNKNOWN_ERROR,
  };
}