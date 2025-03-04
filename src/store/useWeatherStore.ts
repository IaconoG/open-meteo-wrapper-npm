import { create } from "zustand";
// import { devtools } from 'zustand/middleware';
import { fetchWeather } from "../services/weatherService";
import {
  DailyWeatherData,
  FetchWeatherProps,
  HourlyWeatherData,
  StructureWeatherData,
} from "../types/weatherTypes";

interface WeatherState {
  data: StructureWeatherData | null;
  loading: boolean;
  error: string | null;
}

interface WeatherActions {
  fetchWeather: (params: FetchWeatherProps) => Promise<void>;
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => string | null;
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
      set({ loading: true, error: null });

      try {
        const result = await fetchWeather(params);
        if (!result)
          throw new Error("No se pudo obtener los datos meteorológicos");
        set({ data: result, loading: false, error: null });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al obtener los datos meteorológicos";
        set({
          error: errorMessage,
          loading: false,
        });
        throw new Error(errorMessage);
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
