import { BASE_URL } from "../utils/constants";
import {
  FetchWeatherProps,
  WeatherData,
  StructureWeatherData,
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
}: FetchWeatherProps): Promise<StructureWeatherData | null> => {
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
      throw new Error("Error al obtener los datos meteorológicos");
    }

    const data: WeatherData = await response.json();
    const weatherData = new WeatherDataParser(data, past_days, forecast_days);

    return weatherData.parse();
  } catch (error) {
    console.error(error);
    return null;
  }
};
