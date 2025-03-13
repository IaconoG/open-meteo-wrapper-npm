import { renderHook, act, waitFor } from "@testing-library/react";
import { useWeatherStore } from "../store/useWeatherStore";
import { fetchWeather as mockFetchWeather } from "../services/weatherService";
import {
  StructureWeatherData,
  ErrorInitialState,
  ErrorType,
  MessageType,
} from "../types/weatherTypes";
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
    useWeatherStore.setState({
      data: null,
      loading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  /**
   * Test para probar que el store se inicializa correctamente
   */
  it("fetchWeather - should fetch weather data successfully", async () => {
    const mockData: StructureWeatherData = {
      latitude: 40.7128,
      longitude: -74.006,
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
    const mockError = {
      error: "Error desconocido.",
      type: MessageType.WARNING,
      errorType: ErrorType.UNKNOWN_ERROR,
      status: 0,
    };
    (mockFetchWeather as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useWeatherStore());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.fetchWeather({
        latitude: 40.7128,
        longitude: -74.006,
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toStrictEqual(mockError);

    // Asegurarse de que `data` sigue siendo `null`
    expect(result.current.data).toBeNull();
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
      useWeatherStore.setState({
        error: {
          error: "Network error",
          type: MessageType.ERROR,
          errorType: ErrorType.API_ERROR,
          status: 500,
        },
      });
    });

    expect(result.current.hasError()).toBe(true);
    expect(result.current.getError()).toStrictEqual({
      error: "Network error",
      type: MessageType.ERROR,
      errorType: ErrorType.API_ERROR,
      status: 500,
    });

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
      latitude: 0,
      longitude: 0,
    };
    useWeatherStore.setState({ data: mockData });

    const { result } = renderHook(() => useWeatherStore());
    expect(result.current.getAllWeatherData()).toEqual(mockData);
  });

  /**
   * Test para probar que se puede obtener el clima actual
   * - Es necesario establecer la fecha con la zona horaria !!!
   */
  it("should return current hour weather", () => {
    const timezoneTest = "America/New_York";
    const mockData: StructureWeatherData = {
      latitude: 40.7128,
      longitude: -74.006,
      timezone: timezoneTest,
      currentDay: {
        hourly: [
          {
            hour: {
              value: new Date(
                new Date().toLocaleString("en", {
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

  it("should not fetch if cached data is still valid", async () => {
    (mockFetchWeather as jest.Mock).mockResolvedValue({
      latitude: 40.7128,
      longitude: -74.006,
    });

    const now = Date.now();
    // Establecer un tiempo de última obtención reciente
    useWeatherStore.setState({
      data: {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
        currentDay: {},
        pastDay: [],
        forecast: [],
      },
      lastFetchTime: now, // asumiendo que la lógica interna se basa en lastFetchTime
    });

    const { result } = renderHook(() => useWeatherStore());

    await act(async () => {
      await result.current.fetchWeather({
        latitude: 40.7128,
        longitude: -74.006,
      });
    });

    // Si lastFetchTime está dentro del rango de validez, no debería invocar el servicio
    expect(mockFetchWeather).not.toHaveBeenCalled();
  });

  it("should fetch new data if cached data is expired", async () => {
    (mockFetchWeather as jest.Mock).mockResolvedValue({
      latitude: 40.7128,
      longitude: -74.006,
    });

    // Establecer un tiempo de última obtención lejano para forzar la expiración
    useWeatherStore.setState({
      data: {
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
        currentDay: {},
        pastDay: [],
        forecast: [],
      },

      lastFetchTime: Date.now() - 1000 * 60 * 60 * 24, // 24 horas atrás
    });

    const { result } = renderHook(() => useWeatherStore());

    await act(async () => {
      await result.current.fetchWeather({
        latitude: 40.7128,
        longitude: -74.006,
      });
    });

    // En este caso, sí debería llamar al servicio
    expect(mockFetchWeather).toHaveBeenCalledTimes(1);
  });
});
