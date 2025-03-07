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

function isStructureWeatherData(data: any): data is StructureWeatherData {
  return data && typeof data === "object" && "timezone" in data;
}

interface MockResponseData extends StructureWeatherData {}

const server = setupServer(
  http.get<{}, MockResponseData>(BASE_URL, () => {
    return HttpResponse.json(mockWeatherData);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
      expect(weatherData?.timezone).toBe(WEATHER_CONSTANTS.DEFAULT_TIMEZONE);
      expect(weatherData?.currentDay?.hourly?.length).toBeGreaterThan(0);
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
      type: ErrorType.ERROR,
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
      type: ErrorType.WARNING,
    });
  }, 10000);
});
