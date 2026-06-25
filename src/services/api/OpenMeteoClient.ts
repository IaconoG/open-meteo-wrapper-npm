import { BASE_URL, WEATHER_CONSTANTS } from "../../utils/constants";
import {
  FetchWeatherProps,
  FetchError,
  ErrorType,
  MessageType,
  WeatherQueryMode,
} from "../../types/weatherTypes";
import { WeatherData } from "../../types/apiTypes";

export interface IWeatherApiClient {
  fetchRaw(params: FetchWeatherProps): Promise<WeatherData | FetchError>;
}

export class OpenMeteoClient implements IWeatherApiClient {
  async fetchRaw({
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
  }: FetchWeatherProps): Promise<WeatherData | FetchError> {
    try {
      const url = new URL(BASE_URL);
      const params: Record<string, string> = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        hourly: hourly.join(","),
        daily: daily.join(","),
        timezone,
      };

      if (current?.length) {
        params.current = current.join(",");
      }

      if (mode === WeatherQueryMode.TimeInterval) {
        params.start_date = start_date!;
        params.end_date = end_date!;
      } else {
        params.past_days = past_days.toString();
        params.forecast_days = forecast_days.toString();
      }

      const searchParams = new URLSearchParams(params);

      url.search = searchParams.toString();

      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        WEATHER_CONSTANTS.REQUEST_TIMEOUT,
      );

      const response = await fetch(url.toString(), {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status >= 500) {
          return this.buildError({
            error:
              "Debido a un problema en el servidor, no podemos obtener la información del clima.",
            info: "Por favor, inténtalo de nuevo más tarde.",
            status: response.status,
            errorType: ErrorType.API_ERROR,
          });
        } else if (response.status >= 400) {
          if (response.status === 408) {
            return this.buildError({
              error: "La solicitud ha tardado demasiado tiempo en completarse.",
              status: 408,
              info: "Revisa tu conexión a internet e intenta de nuevo.",
              type: MessageType.WARNING,
              errorType: ErrorType.NETWORK_ERROR,
            });
          } else {
            return this.buildError({
              error: "No pudimos obtener la información del clima.",
              info: "Verifica que la ubicación ingresada sea correcta e inténtalo de nuevo.",
              status: response.status,
              type: MessageType.WARNING,
              errorType: ErrorType.API_ERROR,
            });
          }
        } else {
          return this.buildError({
            error: "Ocurrió un error al obtener los datos del clima.",
            status: response.status,
            errorType: ErrorType.UNKNOWN_ERROR,
          });
        }
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return this.buildError({
          error: "La solicitud ha tardado demasiado tiempo en completarse.",
          status: 408,
          info: "Revisa tu conexión a internet e intenta de nuevo.",
          type: MessageType.WARNING,
          errorType: ErrorType.NETWORK_ERROR,
        });
      }

      return this.buildError({
        error:
          "Ocurrió un error inesperado al obtener los datos meteorológicos.",
        type: MessageType.ERROR,
        status: 0,
        errorType: ErrorType.UNKNOWN_ERROR,
      });
    }
  }

  private buildError({
    error,
    info,
    status,
    type,
    errorType,
  }: Partial<FetchError>): FetchError {
    return {
      error: error || "Error desconocido.",
      info,
      status: status || 0,
      type: type || MessageType.ERROR,
      errorType: errorType || ErrorType.UNKNOWN_ERROR,
    };
  }
}
