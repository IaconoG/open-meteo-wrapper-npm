import { BASE_URL } from "../utils/constants";
import {
  FetchWeatherProps,
  WeatherData,
  StructureWeatherData,
  FetchError,
  ErrorType,
  MessageType,
} from "../types/weatherTypes";
import { WEATHER_CONSTANTS } from "../utils/constants";
import { WeatherDataParser } from "../models/weatherDataParser";

export const fetchWeather = async ({
  latitude,
  longitude,
  hourly = WEATHER_CONSTANTS.DEFAULT_HOURLY_VALUE,
  daily = WEATHER_CONSTANTS.DEFAULT_DAILY_VALUE,
  timezone = WEATHER_CONSTANTS.DEFAULT_TIMEZONE,
  past_days = WEATHER_CONSTANTS.DEFAULT_PAST_DAYS,
  forecast_days = WEATHER_CONSTANTS.DEFAULT_FORECAST_DAYS,
}: FetchWeatherProps): Promise<StructureWeatherData | FetchError> => {
  try {
    const url = new URL(BASE_URL);
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: hourly.join(","),
      daily: daily.join(","),
      timezone,
      past_days: past_days.toString(),
      forecast_days: forecast_days.toString(),
    });

    //* Establecemos los parámetros de búsqueda de la URL.
    url.search = params.toString();

    //* Creamos un nuevo AbortController y un temporizador para cancelar la solicitud después de 10 segundos.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    //* Realizamos la solicitud a la API.
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    //* Limpiamos el temporizador.
    clearTimeout(timeout);

    //* Verificamos si la solicitud fue exitosa.
    if (!response.ok) {
      let error: FetchError = {
        error: "Error desconocido.",
        type: MessageType.ERROR,
        errorType: ErrorType.UNKNOWN_ERROR,
        status: 0,
      };
      if (response.status >= 500) {
        error = {
          error:
            "Debido a un problema en el servidor, no podemos obtener la información del clima.",
          info: "Por favor, inténtalo de nuevo más tarde.",
          status: response.status,
          type: MessageType.ERROR,
          errorType: ErrorType.API_ERROR,
        };
      } else if (response.status >= 400) {
        if (response.status === 408) {
          error = {
            error: "La solicitud ha tardado demasiado tiempo en completarse.",
            status: 408,
            info: "Revisa tu conexión a internet e intenta de nuevo.",
            type: MessageType.WARNING,
            errorType: ErrorType.NETWORK_ERROR,
          };
        } else {
          error = {
            error: "No pudimos obtener la información del clima.",
            info: "Verifica que la ubicación ingresada sea correcta e inténtalo de nuevo.",
            status: response.status,
            type: MessageType.WARNING,
            errorType: ErrorType.API_ERROR,
          };
        }
      } else {
        error = {
          error: "Ocurrió un error al obtener los datos del clima.",
          status: response.status,
          type: MessageType.ERROR,
          errorType: ErrorType.UNKNOWN_ERROR,
        };
      }

      return error;
    }

    const data: WeatherData = await response.json();
    const weatherData = new WeatherDataParser(data, past_days, forecast_days);

    return weatherData.parse();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        error: "La solicitud ha tardado demasiado tiempo en completarse.",
        status: 408,
        info: "Revisa tu conexión a internet e intenta de nuevo.",
        type: MessageType.WARNING,
        errorType: ErrorType.NETWORK_ERROR,
      };
    }

    return {
      error: "Ocurrió un error inesperado al obtener los datos meteorológicos.",
      type: MessageType.ERROR,
      status: 0,
      errorType: ErrorType.UNKNOWN_ERROR,
    };
  }
};
