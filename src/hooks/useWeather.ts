/**
 * @description Weather hook to fetch and manage weather data
 *
 */

import { useWeatherStore } from "../store/useWheaterStore";
import {
  DailyWeatherData,
  FetchWeatherProps,
  HourlyWeatherData,
  StructureWeatherData,
} from "../types/weatherTypes";

interface UseWeatherReturn {
  fetchWeather: (params: FetchWeatherProps) => Promise<void>;
  getAllWeatherData: () => StructureWeatherData | null;
  getCurrentDayWeather: () => DailyWeatherData | null;
  getPastDayWeather: () => DailyWeatherData[] | null;
  getForecastWeather: () => DailyWeatherData[] | null;
  getCurrentHourWeather: () => HourlyWeatherData | null;
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => string | null;
}

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
  };
};
