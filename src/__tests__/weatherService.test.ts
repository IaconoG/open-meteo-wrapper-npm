import { fetchWeather } from "../services/weatherService";
import {
  FetchWeatherProps,
  HourlyParams,
  DailyParams,
} from "../types/weatherTypes";
import { WeatherData } from "../types/apiTypes";

// Mock global fetch
global.fetch = jest.fn();

describe("weatherService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchWeather", () => {
    const validParams: FetchWeatherProps = {
      latitude: 40.7128,
      longitude: -74.006,
      hourly: [HourlyParams.Temperature, HourlyParams.WeatherCode],
      daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
    };
    const mockApiResponse: WeatherData = {
      latitude: 40.7128,
      longitude: -74.006,
      timezone: "America/New_York",
      hourly: {
        time: [
          new Date("2025-01-01T00:00:00Z"),
          new Date("2025-01-01T01:00:00Z"),
        ],
        temperature_2m: [20, 19],
        weather_code: [0, 1],
      },
      daily: {
        time: [new Date("2025-01-01")],
        temperature_2m_max: [25],
        temperature_2m_min: [15],
        sunrise: [new Date("2025-01-01T07:00:00Z")],
        sunset: [new Date("2025-01-01T18:00:00Z")],
      },
    };

    it("should fetch and parse weather data successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchWeather(validParams);

      // Verificar que fetch fue llamado correctamente
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://api.open-meteo.com/v1/forecast"),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        }),
      );

      // Verificar URL parameters
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      const url = new URL(fetchCall);
      expect(url.searchParams.get("latitude")).toBe("40.7128");
      expect(url.searchParams.get("longitude")).toBe("-74.006");
      expect(url.searchParams.get("hourly")).toBe(
        "temperature_2m,weather_code",
      );

      // Verificar estructura de datos parseada
      expect(result).toHaveProperty("latitude", 40.7128);
      expect(result).toHaveProperty("longitude", -74.006);
      expect(result).toHaveProperty("timezone", "America/New_York");
      expect(result).toHaveProperty("currentDay");
      expect(result).toHaveProperty("pastDay");
      expect(result).toHaveProperty("forecast");
    });

    it("should handle 500 server errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetchWeather(validParams);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("status", 500);
      expect(result).toHaveProperty("type", "error");
      expect(result).toHaveProperty("errorType", "api_error");
    });

    it("should handle 400 client errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await fetchWeather(validParams);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("status", 400);
      expect(result).toHaveProperty("type", "warning");
      expect(result).toHaveProperty("errorType", "api_error");
    });

    it("should handle network timeout", async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(
              () => reject(new DOMException("AbortError", "AbortError")),
              100,
            );
          }),
      );

      const result = await fetchWeather(validParams);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("status", 408);
      expect(result).toHaveProperty("type", "warning");
      expect(result).toHaveProperty("errorType", "network_error");
    });

    it("should handle malformed JSON response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const result = await fetchWeather(validParams);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("type", "error");
      expect(result).toHaveProperty("errorType", "unknown_error");
    });

    it("should use default parameters when not provided", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      await fetchWeather({
        latitude: 40.7128,
        longitude: -74.006,
      });

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      const url = new URL(fetchCall);

      expect(url.searchParams.get("hourly")).toBe(
        "temperature_2m,weather_code",
      );
      expect(url.searchParams.get("daily")).toBe(
        "temperature_2m_max,temperature_2m_min",
      );
      expect(url.searchParams.get("timezone")).toBe("America/Sao_Paulo");
      expect(url.searchParams.get("past_days")).toBe("0");
      expect(url.searchParams.get("forecast_days")).toBe("7");
    });

    it("should handle fetch abortion after timeout", async () => {
      jest.useFakeTimers();

      const mockAbort = jest.fn();
      const mockController = {
        abort: mockAbort,
        signal: { aborted: false } as AbortSignal,
      };

      global.AbortController = jest.fn(() => mockController) as jest.Mock;

      const fetchPromise = new Promise(() => {}); // Promise que nunca se resuelve
      (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

      void fetchWeather(validParams);

      // Avanzar 10 segundos para activar el timeout
      jest.advanceTimersByTime(10000);

      expect(mockAbort).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
