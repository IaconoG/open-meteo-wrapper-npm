import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { fetchWeather } from "../services/weatherService";
import {
  DailyWeatherData,
  FetchWeatherProps,
  HourlyWeatherData,
  StructureWeatherData,
  FetchError,
  ErrorType,
  MessageType,
} from "../types/weatherTypes";

// Permite inyectar un fetcher para tests o para cambiar proveedor
export type WeatherFetcher = (params: FetchWeatherProps) => Promise<StructureWeatherData | FetchError>;
// Usa un wrapper para permitir la inyección de un fetcher personalizado (útil para tests o cambios futuros de proveedor)
let defaultFetcher: WeatherFetcher = (params) => fetchWeather(params);

export const setWeatherFetcher = (fetcher: WeatherFetcher) => {
  defaultFetcher = fetcher;
};

/**
 * Estado principal del store meteorológico.
 */
interface WeatherState {
  /** Últimos datos meteorológicos obtenidos y organizados */
  data: StructureWeatherData | null;
  /** Indica si se está realizando una solicitud */
  loading: boolean;
  /** Último error producido en la consulta */
  error: FetchError | null;
  /** Si la actualización automática está activa */
  autoRefresh: boolean;
  /** Últimos parámetros usados para la consulta */
  fetchParams: FetchWeatherProps | null;
  /** Timestamp de la última consulta exitosa */
  lastFetchTime: number | null;
  /** Duración del caché en milisegundos */
  cacheDuration: number;
}

/**
 * Acciones y selectores del store meteorológico.
 * 
 * `fetchWeather`: Realiza la consulta meteorológica y actualiza el estado.
 * `isLoading`, `hasError`, `getError`, `clearError`: Métodos para manejar el estado de carga y errores.
 * `setAutoRefresh`, `scheduleAutoRefresh`: Métodos para manejar la actualización automática de datos.
 * `getAllWeatherData`, `getCurrentDayWeather`, `getPastDayWeather`, `getForecastWeather`, `getCurrentHourWeather`: Selectores para acceder a los datos meteorológicos organizados.
 */
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
 * Compara dos objetos de parámetros de consulta meteorológica.
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
       * Si los parámetros y el caché lo permiten, reutiliza los datos existentes.
       * Si no, realiza una nueva consulta y actualiza el estado.
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
        } // Establece el estado de carga y limpia cualquier error previo
        set(
          produce((draft) => {
            draft.loading = true;
            draft.error = null;
            draft.fetchParams = params;
          }),
        );

        try {
          const result = await defaultFetcher(params);

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

      /** Indica si está en proceso de carga */
      isLoading: () => get().loading,

      /** Indica si se ha producido algún error */
      hasError: () => get().error !== null,

      /** Devuelve el error actual */
      getError: () => get().error,

      /** Limpia el error actual */
      clearError: () =>
        set(
          produce((draft) => {
            draft.error = null;
          }),
        ),

      /**
       * Activa o desactiva la actualización automática.
       * Si se activa, programa la actualización para la próxima medianoche local.
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

      /** Devuelve todos los datos meteorológicos */
      getAllWeatherData: () => get().data,
      getCurrentDayWeather: () => get().data?.currentDay || null,
      getPastDayWeather: () => get().data?.pastDay || null,
      getForecastWeather: () => get().data?.forecast || null,

      /**
       * Devuelve los datos meteorológicos de la hora actual.
       * Busca la hora local actual en el array de horas del día.
       */
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
      partialize: (state) => ({
        data: state.data,
        fetchParams: state.fetchParams,
        lastFetchTime: state.lastFetchTime,
        autoRefresh: state.autoRefresh,
      }),
    },
  ),
);
