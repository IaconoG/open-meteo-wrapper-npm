import { create } from "zustand";
// import { devtools } from 'zustand/middleware';
import { fetchWeather } from "../services/weatherService";
import {
  DailyWeatherData,
  FetchWeatherProps,
  HourlyWeatherData,
  StructureWeatherData,
  FetchError,
  ErrorType,
  MessageType,
  ErrorInitialState,
} from "../types/weatherTypes";

interface WeatherState {
  data: StructureWeatherData | null;
  loading: boolean;
  error: FetchError | null;
}

interface WeatherActions {
  fetchWeather: (params: FetchWeatherProps) => Promise<void>;
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => FetchError | null;
  clearError: () => void;

  // Funciones para obtener los datos meteorológicos
  getAllWeatherData: () => StructureWeatherData | null;
  getCurrentDayWeather: () => DailyWeatherData | null;
  getPastDayWeather: () => DailyWeatherData[] | null;
  getForecastWeather: () => DailyWeatherData[] | null;

  // Funciones especificas
  getCurrentHourWeather: () => HourlyWeatherData | null;
}

export const useWeatherStore = create<WeatherState & WeatherActions>(
  (set, get) => ({
    data: null,
    loading: false,
    error: null,

    fetchWeather: async (params) => {
      set({ loading: true, error: ErrorInitialState });

      try {
        const result = await fetchWeather(params);

        if ("error" in (result as FetchError)) {
          set({
            error: result as FetchError,
            loading: false,
          });
          return;
        }

        const data = result as StructureWeatherData;
        set({ data: data, loading: false, error: null });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";

        set({
          error: {
            error: errorMessage,
            type: MessageType.WARNING,
            errorType: ErrorType.UNKNOWN_ERROR,
            status: 0, // Status 0 para errores desconocidos
          },
          loading: false,
        });
      }
    },

    isLoading: () => get().loading,
    hasError: () => get().error !== null,
    getError: () => get().error,

    clearError: () => set({ error: null }),

    getAllWeatherData: () => get().data,
    getCurrentDayWeather: () => get().data?.currentDay || null,
    getPastDayWeather: () => get().data?.pastDay || null,
    getForecastWeather: () => get().data?.forecast || null,

    getCurrentHourWeather() {
      const { data } = get();
      if (!data) return null;
      const timezone = data.timezone;

      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: timezone,
      });
      const currentHour = new Date(currentDate);

      const currentHourWeather = data.currentDay?.hourly?.find((hour) => {
        if (!hour.hour) return null;
        const hourDate = new Date(hour.hour.value);
        return hourDate.getHours() === currentHour.getHours();
      });
      return currentHourWeather || null;
    },
  }),
);
