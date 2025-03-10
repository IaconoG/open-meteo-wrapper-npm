/**
 * @description
 * El objetivo del test es probar el servicio, no el servicio externo. Si el servicio real
 * (weatherService.ts) falla o cambia, podría romper el test, aunque el servicio siga
 * funcionando bien.
 */

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { fetchWeather } from "../services/weatherService";
import {
  DailyParams,
  FetchWeatherProps,
  HourlyParams,
  StructureWeatherData,
  WeatherData,
  ErrorType,
  MessageType,
} from "../types/weatherTypes";
import { BASE_URL, WEATHER_CONSTANTS } from "../utils/constants";

/**
 * Mock de los datos meteorológicos.
 */
const mockWeatherData: WeatherData = {
  latitude: 40.7128,
  longitude: -74.006,
  timezone: WEATHER_CONSTANTS.DEFAULT_TIMEZONE,
  timezone_abbreviation: "UTC",
  current: { time: new Date() },
  hourly: { temperature_2m: [20], weather_code: [800], time: [new Date()] },
  daily: {
    time: [new Date()],
    temperature_2m_max: [25],
    temperature_2m_min: [15],
  },
};

/**
 * Verifica si los datos tienen la estructura de StructureWeatherData.
 */
function isStructureWeatherData(data: unknown): data is StructureWeatherData {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  return (
    "latitude" in data &&
    "longitude" in data &&
    "timezone" in data &&
    "currentDay" in data &&
    "pastDay" in data &&
    "forecast" in data
  );
}

/**
 * Tipo de datos de respuesta simulada.
 */
type MockResponseData = StructureWeatherData;

/**
 * Configuración del servidor de pruebas con msw.
 */
const server = setupServer(
  http.get<object, MockResponseData>(BASE_URL, () => {
    return HttpResponse.json(mockWeatherData);
  }),
);

// Configuración y limpieza del servidor de pruebas
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Descripción de los tests para fetchWeather
describe("fetchWeather", () => {
  const mockFetchProps: FetchWeatherProps = {
    latitude: 40.7128,
    longitude: -74.006,
    hourly: [HourlyParams.Temperature2m],
    daily: [DailyParams.Temperature2mMax, DailyParams.Temperature2mMin],
    timezone: WEATHER_CONSTANTS.DEFAULT_TIMEZONE,
    forecast_days: 1,
  };

  it("should fetch weather data successfully", async () => {
    const weatherData = await fetchWeather(mockFetchProps);

    if (isStructureWeatherData(weatherData)) {
      expect(weatherData.latitude).toBe(mockWeatherData.latitude);
      expect(weatherData.longitude).toBe(mockWeatherData.longitude);
      expect(weatherData.timezone).toBe(mockWeatherData.timezone);
      expect(weatherData.currentDay.hourly).not.toBeUndefined();
      expect(weatherData.pastDay.length).toBe(0);
      expect(weatherData.forecast.length).toBe(0);
    } else {
      fail("The data is not a StructureWeatherData object.");
    }
  });

  it("should handle errors and return error data when the request fails", async () => {
    server.use(
      http.get(BASE_URL, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const weatherData = await fetchWeather({
      latitude: -34.9215,
      longitude: -57.9545,
    });

    expect(weatherData).toHaveProperty("error");
    expect(weatherData).toHaveProperty("status", 500);
    expect(weatherData).toEqual({
      error:
        "Debido a un problema en el servidor, no podemos obtener la información del clima.",
      info: "Por favor, inténtalo de nuevo más tarde.",
      status: 500,
      type: MessageType.ERROR,
      errorType: ErrorType.API_ERROR,
    });
  });

  it("should handle errors and return error data when the request times out", async () => {
    server.use(
      http.get(BASE_URL, () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(new HttpResponse(null, { status: 408 }));
          }, 5000);
        });
      }),
    );

    const weatherData = await fetchWeather({
      latitude: -34.9215,
      longitude: -57.9545,
    });

    expect(weatherData).toHaveProperty("error");
    expect(weatherData).toHaveProperty("status", 408);
    expect(weatherData).toEqual({
      error: "La solicitud ha tardado demasiado tiempo en completarse.",
      status: 408,
      info: "Revisa tu conexión a internet e intenta de nuevo.",
      type: MessageType.WARNING,
      errorType: ErrorType.NETWORK_ERROR,
    });
  }, 10000);
});
