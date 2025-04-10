import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { fetchWeather } from "@/services/weatherService";
import {
  DailyWeatherData,
  FetchWeatherProps,
  HourlyWeatherData,
  StructureWeatherData,
  FetchError,
  ErrorType,
  MessageType,
  ErrorInitialState,
} from "@/types/weatherTypes";

interface WeatherState {
  data: StructureWeatherData | null;
  loading: boolean;
  error: FetchError | null;
  autoRefresh: boolean;
  fetchParams: FetchWeatherProps | null;
  // Variables de caché
  lastFetchTime: number | null;
  cacheDuration: number;
}

interface WeatherActions {
  fetchWeather: (params: FetchWeatherProps) => Promise<void>;
  isLoading: () => boolean;
  hasError: () => boolean;
  getError: () => FetchError | null;
  clearError: () => void;
  setAutoRefresh: (value: boolean) => void;
  scheduleAutoRefresh: () => void;
  getAllWeatherData: () => StructureWeatherData | null;
  getCurrentDayWeather: () => DailyWeatherData | null;
  getPastDayWeather: () => DailyWeatherData[] | null;
  getForecastWeather: () => DailyWeatherData[] | null;
  getCurrentHourWeather: () => HourlyWeatherData | null;
}

/**
 * @param a Primer objeto de parámetros de solicitud.
 * @param b Segundo objeto de parámetros de solicitud.
 * @returns Devuelve true si los parámetros de solicitud son iguales.
 */
function areFetchParamsEqual(a: FetchWeatherProps, b: FetchWeatherProps) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      error: null,
      autoRefresh: true,
      fetchParams: null,

      // Variables de caché
      lastFetchTime: null,
      cacheDuration: 10 * 60 * 1000, // 10 minutos por defecto

      /**
       * Realiza la solicitud para obtener datos meteorológicos.
       * Primero revisa si los parámetros son los mismos usados la última vez,
       * si ya existe data, y si no ha pasado el tiempo suficiente (cacheDuration).
       * Si todo se cumple, no hace un nuevo fetch.
       */
      fetchWeather: async (params) => {
        const state = get();
        const now = Date.now();

        // 1) Verifica si los parámetros no han cambiado
        // 2) Verifica si ya existe data previa
        // 3) Verifica si la última solicitud está dentro del rango de caché
        const canUseCachedData =
          state.fetchParams &&
          areFetchParamsEqual(state.fetchParams, params) &&
          state.data &&
          state.lastFetchTime !== null &&
          now - state.lastFetchTime < state.cacheDuration;

        if (canUseCachedData) {
          // No se necesita hacer una nueva solicitud, usar datos en caché
          return;
        }

        // Establece el estado de carga y limpia cualquier error previo
        set(
          produce((draft) => {
            draft.loading = true;
            draft.error = ErrorInitialState;
            draft.fetchParams = params;
          }),
        );

        try {
          const result = await fetchWeather(params);

          // Verifica si la respuesta contiene un error
          if ("error" in (result as FetchError)) {
            set(
              produce((draft) => {
                draft.error = result as FetchError;
                draft.loading = false;
              }),
            );
            return;
          }

          // Actualiza el estado con los datos obtenidos y la hora del fetch
          set(
            produce((draft) => {
              draft.data = result as StructureWeatherData;
              draft.loading = false;
              draft.error = null;
              draft.lastFetchTime = Date.now(); // Cacheamos la hora de esta respuesta
            }),
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido.";

          set(
            produce((draft) => {
              draft.error = {
                error: errorMessage,
                type: MessageType.WARNING,
                errorType: ErrorType.UNKNOWN_ERROR,
                status: 0,
              };
              draft.loading = false;
            }),
          );
        }
      },

      // Verifica si está en proceso de carga
      isLoading: () => get().loading,

      // Verifica si se ha producido algún error
      hasError: () => get().error !== null,

      // Obtiene el error actual
      getError: () => get().error,

      // Limpia el error
      clearError: () =>
        set(
          produce((draft) => {
            draft.error = null;
          }),
        ),

      /**
       * Activa o desactiva la actualización automática.
       * Al activarse, programa una llamada a scheduleAutoRefresh().
       */
      setAutoRefresh: (value) => {
        set({ autoRefresh: value });
        if (value) get().scheduleAutoRefresh();
      },

      /**
       * Programa una actualización automática de datos para la medianoche local
       * en la zona horaria de los datos obtenidos, y vuelve a programarla
       * cada vez que se llega a esa hora.
       */
      scheduleAutoRefresh: () => {
        const { data, fetchParams } = get();
        if (!data || !data.timezone || !fetchParams) return;

        const now = new Date().toLocaleString("es-ES", {
          timeZone: data.timezone,
        });
        const currentDate = new Date(now);

        const midnight = new Date(currentDate);
        midnight.setHours(24, 0, 0, 0); // Próxima medianoche
        const timeToMidnight = midnight.getTime() - currentDate.getTime();

        setTimeout(async () => {
          await get().fetchWeather(fetchParams);
          get().scheduleAutoRefresh();
        }, timeToMidnight);
      },

      // Métodos para obtener datos concretos
      getAllWeatherData: () => get().data,
      getCurrentDayWeather: () => get().data?.currentDay || null,
      getPastDayWeather: () => get().data?.pastDay || null,
      getForecastWeather: () => get().data?.forecast || null,

      // Devuelve los datos meteorológicos de la hora actual
      getCurrentHourWeather() {
        const { data } = get();
        if (!data) return null;

        const timezone = data.timezone;
        const currentLocaleString = new Date().toLocaleString("en", {
          timeZone: timezone,
        });
        const currentHour = new Date(currentLocaleString);

        // Buscar el pronóstico de la hora actual
        const currentHourWeather = data.currentDay?.hourly?.find((hour) => {
          if (!hour.hour) return null;
          const hourDate = new Date(hour.hour.value);
          return hourDate.getHours() === currentHour.getHours();
        });
        return currentHourWeather || null;
      },
    }),
    {
      name: "weather-store",
    },
  ),
);

// Programar la actualización automática en la carga de la aplicación
if (useWeatherStore.getState().autoRefresh) {
  useWeatherStore.getState().scheduleAutoRefresh();
}
