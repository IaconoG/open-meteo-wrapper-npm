/**
 * @description
 * El objetivo del test es probar el store, no el servicio externo. Si el servicio real
 * (weatherService.ts) falla o cambia, podría romper el test, aunque el store siga funcionando bien.
 *
 * Para esto se puede usar un mock del servicio, para que devuelva datos controlados y no dependa
 * de un servicio externo.
 */

import { renderHook, act } from "@testing-library/react";
import { useWeatherStore } from "../store/useWeatherStore";
import { fetchWeather as mockFetchWeather } from "../services/weatherService";
import { StructureWeatherData } from "../types/weatherTypes";
import { WEATHER_CONSTANTS } from "../utils/constants";

/**
 * Mock del servicio fetchWeather
 */
jest.mock("../services/weatherService", () => ({
  fetchWeather: jest.fn(),
}));

describe("useWeatherStore", () => {
  /**
   * Antes de cada test, se limpian los datos del store y se limpian los mocks
   * para que no interfieran entre tests.
   */
  beforeEach(() => {
    useWeatherStore.setState({ data: null, loading: false, error: null });
    jest.clearAllMocks();
  });

  /**
   * Test para probar que el store se inicializa correctamente
   */
  it("fetchWeather - should fetch weather data successfully", async () => {
    const mockData: StructureWeatherData = {
      timezone: "America/New_York",
      currentDay: {
        hourly: [
          { hour: { value: new Date(2025, 2, 4, 12), unit: "iso8601" } },
        ],
      },
      pastDay: [],
      forecast: [],
    };
    (mockFetchWeather as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useWeatherStore());

    await act(async () => {
      await result.current.fetchWeather({
        latitude: 40.7128,
        longitude: -74.006,
      });
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  /**
   * Test para probar que el store maneja correctamente los errores
   */
  it("fetchWeather - should handle errors", async () => {
    (mockFetchWeather as jest.Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useWeatherStore());

    await act(async () => {
      await expect(
        result.current.fetchWeather({ latitude: 40.7128, longitude: -74.006 }),
      ).rejects.toThrow("API error");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("API error");
  });

  /**
   * Test para probar que el store maneja correctamente el estado de carga
   */
  it("should check loading state", () => {
    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      useWeatherStore.setState({ loading: true });
    });

    expect(result.current.isLoading()).toBe(true);
  });

  /**
   * Test para probar que el store maneja correctamente el estado de error
   * y que se puede limpiar el error
   */
  it("should check error state", () => {
    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      useWeatherStore.setState({ error: "Network error" });
    });

    expect(result.current.hasError()).toBe(true);
    expect(result.current.getError()).toBe("Network error");

    act(() => {
      result.current.clearError();
    });

    expect(result.current.hasError()).toBe(false);
    expect(result.current.getError()).toBeNull();
  });

  /**
   * Test para probar que se puede obtener el clima actual
   */
  it("should return all weather data", () => {
    const mockData: StructureWeatherData = {
      currentDay: {},
      pastDay: [],
      forecast: [],
      timezone: WEATHER_CONSTANTS.DEFAULT_TIMEZONE,
    };
    useWeatherStore.setState({ data: mockData });

    const { result } = renderHook(() => useWeatherStore());
    expect(result.current.getAllWeatherData()).toEqual(mockData);
  });

  /**
   * Test para probar que se puede obtener el clima actual
   * - Es necesario establecer la fecha con la zona horaria correcta !!!
   */
  it("should return current hour weather", () => {
    const timezoneTest = "America/New_York";
    const mockData: StructureWeatherData = {
      timezone: timezoneTest,
      currentDay: {
        hourly: [
          {
            hour: {
              value: new Date(
                new Date().toLocaleString("en-US", {
                  timeZone: timezoneTest,
                }),
              ),
              unit: "iso8601",
            },
            temperature: { value: 20, unit: "ºC" },
          },
        ],
      },
      pastDay: [],
      forecast: [],
    };
    useWeatherStore.setState({ data: mockData });

    const { result } = renderHook(() => useWeatherStore());

    const expected = mockData.currentDay.hourly
      ? mockData.currentDay.hourly[0]
      : null;

    expect(result.current.getCurrentHourWeather()).toEqual(expected);
  });

  /**
   * Test para probar que se puede obtener el clima actual
   */
  it("should return null if no data is available", () => {
    const { result } = renderHook(() => useWeatherStore());

    expect(result.current.getAllWeatherData()).toBeNull();
    expect(result.current.getCurrentDayWeather()).toBeNull();
    expect(result.current.getPastDayWeather()).toBeNull();
    expect(result.current.getForecastWeather()).toBeNull();
    expect(result.current.getCurrentHourWeather()).toBeNull();
  });
});
