import { useWeatherStore } from "@/store/useWeatherStore";
import {
  DailyWeatherData,
  FetchError,
  FetchWeatherProps,
  HourlyWeatherData,
  StructureWeatherData,
} from "@/types/weatherTypes";

/**
 * Definición de las funciones disponibles para el hook useWeather
 */
interface UseWeatherReturn {
  fetchWeather: (params: FetchWeatherProps) => Promise<void>;
  getAllWeatherData: () => StructureWeatherData | null;
  getCurrentDayWeather: () => DailyWeatherData | null;
  getPastDayWeather: () => DailyWeatherData[] | null;
  getForecastWeather: () => DailyWeatherData[] | null;
  getCurrentHourWeather: () => HourlyWeatherData | null;
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => FetchError | null;
  setAutoRefresh: (value: boolean) => void;
}

/**
 * Hook personalizado para el manejo de los datos meteorológicos
 */
export const useWeather = (): UseWeatherReturn => {
  const {
    fetchWeather,
    getAllWeatherData,
    getCurrentDayWeather,
    getPastDayWeather,
    getForecastWeather,
    getCurrentHourWeather,
    isLoading,
    hasError,
    getError,
    setAutoRefresh,
  } = useWeatherStore();

  return {
    fetchWeather,
    getAllWeatherData,
    getCurrentDayWeather,
    getPastDayWeather,
    getForecastWeather,
    getCurrentHourWeather,
    isLoading,
    hasError,
    getError,
    setAutoRefresh,
  };
};
