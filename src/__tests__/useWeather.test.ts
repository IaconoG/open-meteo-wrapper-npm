import { renderHook, act } from "@testing-library/react";
import { useWeather } from "../hooks/useWeather";
import { useWeatherStore } from "../store/useWeatherStore";
import { fetchWeather as mockFetchWeather } from "../services/weatherService";
import {
  StructureWeatherData,
  ErrorType,
  MessageType,
  FetchWeatherProps,
} from "../types/weatherTypes";
import { WEATHER_CONSTANTS } from "../utils/constants";

// Mock del servicio fetchWeather para aislar las pruebas de llamadas reales a la API
jest.mock("../services/weatherService", () => ({
  fetchWeather: jest.fn(),
}));

describe("Weather System Tests", () => {
  // Datos simulados para pruebas exitosas
  const mockWeatherData: StructureWeatherData = {
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
    currentDay: {
      day: { value: new Date("2025-01-01"), unit: "iso8601" },
      temperatureMax: { value: 25, unit: "ºC" },
      temperatureMin: { value: 15, unit: "ºC" },
      hourly: [
        {
          hour: { value: new Date("2025-01-01T12:00:00Z"), unit: "iso8601" },
          temperature: { value: 20, unit: "ºC" },
        },
      ],
    },
    pastDay: [],
    forecast: [],
  };

  // Restaurar el estado inicial del store y limpiar mocks antes de cada test
  beforeEach(() => {
    useWeatherStore.setState({
      data: null,
      loading: false,
      error: null,
      autoRefresh: false,
      fetchParams: null,
      lastFetchTime: null,
    });
    jest.clearAllMocks();
  });

  // Pruebas para el store de weather
  describe("useWeatherStore", () => {
    it("should fetch weather data successfully", async () => {
      // Debe obtener datos correctamente y actualizar el estado
      (mockFetchWeather as jest.Mock).mockResolvedValue(mockWeatherData);
      const { result } = renderHook(() => useWeatherStore());
      await act(async () => {
        await result.current.fetchWeather({
          latitude: 40.7128,
          longitude: -74.006,
        });
      });
      expect(result.current.data).toEqual(mockWeatherData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.lastFetchTime).toBeTruthy();
    });

    it("should handle API errors correctly", async () => {
      // Debe manejar correctamente los errores provenientes de la API
      const mockError = {
        error: "API Error occurred",
        type: MessageType.ERROR,
        errorType: ErrorType.API_ERROR,
        status: 500,
      };
      (mockFetchWeather as jest.Mock).mockResolvedValue(mockError);
      const { result } = renderHook(() => useWeatherStore());
      await act(async () => {
        await result.current.fetchWeather({
          latitude: 40.7128,
          longitude: -74.006,
        });
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeNull();
    });

    it("should implement caching mechanism", async () => {
      // Debe usar caché si los parámetros y el tiempo de expiración lo permiten
      (mockFetchWeather as jest.Mock).mockResolvedValue(mockWeatherData);
      const { result } = renderHook(() => useWeatherStore());
      const params: FetchWeatherProps = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      // Primera llamada
      await act(async () => {
        await result.current.fetchWeather(params);
      });
      expect(mockFetchWeather).toHaveBeenCalledTimes(1);
      // Segunda llamada inmediata (debería usar caché)
      await act(async () => {
        await result.current.fetchWeather(params);
      });
      expect(mockFetchWeather).toHaveBeenCalledTimes(1); // No debe llamar nuevamente
    });

    it("should provide getter methods", () => {
      // Los métodos getter deben devolver los datos correctos
      const { result } = renderHook(() => useWeatherStore());
      act(() => {
        useWeatherStore.setState({ data: mockWeatherData });
      });
      expect(result.current.getAllWeatherData()).toEqual(mockWeatherData);
      expect(result.current.getCurrentDayWeather()).toEqual(
        mockWeatherData.currentDay,
      );
      expect(result.current.getPastDayWeather()).toEqual(
        mockWeatherData.pastDay,
      );
      expect(result.current.getForecastWeather()).toEqual(
        mockWeatherData.forecast,
      );
    });

    it("should handle loading state correctly", async () => {
      // El estado loading debe reflejar correctamente el ciclo de la petición
      let resolvePromise: (value: StructureWeatherData) => void;
      const promise = new Promise<StructureWeatherData>((resolve) => {
        resolvePromise = resolve;
      });
      (mockFetchWeather as jest.Mock).mockReturnValue(promise);
      const { result } = renderHook(() => useWeatherStore());
      // Inicia fetch
      act(() => {
        result.current.fetchWeather({
          latitude: 40.7128,
          longitude: -74.006,
        });
      });
      expect(result.current.isLoading()).toBe(true);
      // Resuelve la promesa
      await act(async () => {
        resolvePromise(mockWeatherData);
        await promise;
      });
      expect(result.current.isLoading()).toBe(false);
    });

    it("fetchWeather - should handle errors", async () => {
      // Debe manejar errores inesperados correctamente
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
      expect(result.current.data).toBeNull();
    });

    it("should check loading state", () => {
      // El método isLoading debe reflejar el estado actual de loading
      const { result } = renderHook(() => useWeatherStore());
      act(() => {
        useWeatherStore.setState({ loading: true });
      });
      expect(result.current.isLoading()).toBe(true);
    });

    it("should check error state", () => {
      // El método hasError y getError deben funcionar correctamente
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

    it("should return all weather data", () => {
      // getAllWeatherData debe devolver los datos completos almacenados
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

    it("should return current hour weather", () => {
      // getCurrentHourWeather debe devolver el dato horario actual si existe
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

    it("should return null if no data is available", () => {
      // Todos los getters deben devolver null si no hay datos
      const { result } = renderHook(() => useWeatherStore());
      expect(result.current.getAllWeatherData()).toBeNull();
      expect(result.current.getCurrentDayWeather()).toBeNull();
      expect(result.current.getPastDayWeather()).toBeNull();
      expect(result.current.getForecastWeather()).toBeNull();
      expect(result.current.getCurrentHourWeather()).toBeNull();
    });

    it("should not fetch if cached data is still valid", async () => {
      // No debe llamar a la API si los datos en caché siguen siendo válidos
      const params: FetchWeatherProps = {
        latitude: 40.7128,
        longitude: -74.006,
      };
      (mockFetchWeather as jest.Mock).mockResolvedValue({
        latitude: params.latitude,
        longitude: params.longitude,
      });
      const now = Date.now();
      useWeatherStore.setState({
        data: {
          latitude: params.latitude,
          longitude: params.longitude,
          timezone: "America/New_York",
          currentDay: {},
          pastDay: [],
          forecast: [],
        },
        fetchParams: params,
        lastFetchTime: now, // asumiendo que la lógica interna se basa en lastFetchTime
      });
      const { result } = renderHook(() => useWeatherStore());
      await act(async () => {
        await result.current.fetchWeather({
          latitude: 40.7128,
          longitude: -74.006,
        });
      });
      expect(mockFetchWeather).not.toHaveBeenCalled();
    });

    it("should fetch new data if cached data is expired", async () => {
      // Debe llamar a la API si los datos en caché han expirado
      (mockFetchWeather as jest.Mock).mockResolvedValue({
        latitude: 40.7128,
        longitude: -74.006,
      });
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
      expect(mockFetchWeather).toHaveBeenCalledTimes(1);
    });
  });

  // Pruebas para el custom hook useWeather
  describe("useWeather Hook", () => {
    it("should provide weather data and actions", () => {
      // El hook debe exponer todas las propiedades y métodos esperados
      const { result } = renderHook(() => useWeather());
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("currentDay");
      expect(result.current).toHaveProperty("pastDays");
      expect(result.current).toHaveProperty("forecast");
      expect(result.current).toHaveProperty("currentHour");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("fetchWeather");
      expect(result.current).toHaveProperty("setAutoRefresh");
      expect(result.current).toHaveProperty("clearError");
    });

    it("should handle auto-refresh setup", () => {
      // El hook debe configurar el auto-refresh si está habilitado
      const mockScheduleAutoRefresh = jest.fn();
      useWeatherStore.setState({
        autoRefresh: true,
        fetchParams: { latitude: 40.7128, longitude: -74.006 },
        scheduleAutoRefresh: mockScheduleAutoRefresh,
      });
      renderHook(() => useWeather());
      expect(mockScheduleAutoRefresh).toHaveBeenCalled();
    });

    it("should memoize data to prevent unnecessary re-renders", async () => {
      // Los datos deben ser memoizados para evitar renders innecesarios
      (mockFetchWeather as jest.Mock).mockResolvedValue(mockWeatherData);
      const { result, rerender } = renderHook(() => useWeather());
      act(() => {
        useWeatherStore.setState({ data: mockWeatherData });
      });
      const firstData = result.current.data;
      rerender();
      const secondData = result.current.data;
      expect(firstData).toBe(secondData);
    });

    it("should handle error states properly", () => {
      // El hook debe exponer correctamente los errores del store
      const mockError = {
        error: "Test error",
        type: MessageType.ERROR,
        errorType: ErrorType.UNKNOWN_ERROR,
        status: 0,
      };
      act(() => {
        useWeatherStore.setState({ error: mockError });
      });
      const { result } = renderHook(() => useWeather());
      expect(result.current.error).toEqual(mockError);
    });

    it("should integrate fetchWeather, store, and hook (end-to-end)", async () => {
      // Simula el flujo completo: fetchWeather (servicio) -> store -> hook
      (mockFetchWeather as jest.Mock).mockResolvedValueOnce(mockWeatherData);
      const { result } = renderHook(() => useWeather());
      // Ejecuta la acción de fetchWeather desde el hook
      await act(async () => {
        await result.current.fetchWeather({
          latitude: 40.7128,
          longitude: -74.006,
        });
      });
      // Verifica que los datos se reflejan correctamente en el hook
      expect(result.current.data).toEqual(mockWeatherData);
      expect(result.current.currentDay).toEqual(mockWeatherData.currentDay);
      expect(result.current.pastDays).toEqual(mockWeatherData.pastDay);
      expect(result.current.forecast).toEqual(mockWeatherData.forecast);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
