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
  ErrorInitialState,
} from "../types/weatherTypes";

/**
 * Definición del estado de la store de datos meteorológicos
 */
interface WeatherState {
  data: StructureWeatherData | null;
  loading: boolean;
  error: FetchError | null;
  autoRefresh: boolean; // Opción por defecto
  fetchParams: FetchWeatherProps | null;
}

/**
 * Definición de las acciones disponibles en la store de datos meteorológicos
 */
interface WeatherActions {
  //Acción para obtener los datos meteorológicos
  fetchWeather: (params: FetchWeatherProps) => Promise<void>;

  //Función para verificar si está cargando
  isLoading: () => boolean;
  //Función para verificar si hay un error
  hasError: () => boolean;
  //Función para obtener el error
  getError: () => FetchError | null;
  //Función para limpiar el error
  clearError: () => void;

  // Función para obtener el estado de la actualización automática
  setAutoRefresh: (value: boolean) => void; // Acción para configurar el refresco automático
  // Función para programar la actualización de los datos meteorológicos automáticamente
  scheduleAutoRefresh: () => void; // Acción para programar el refresco automático

  //Función para obtener todos los datos meteorológicos
  getAllWeatherData: () => StructureWeatherData | null;
  //Función para obtener los datos meteorológicos del día actual
  getCurrentDayWeather: () => DailyWeatherData | null;
  //Función para obtener los datos meteorológicos de días pasados
  getPastDayWeather: () => DailyWeatherData[] | null;
  //Función para obtener los datos meteorológicos del pronóstico
  getForecastWeather: () => DailyWeatherData[] | null;

  //Función para obtener los datos meteorológicos de la hora actual
  getCurrentHourWeather: () => HourlyWeatherData | null;
}

/**
 * Creación de la store de datos meteorológicos utilizando Zustand
 */
export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      error: null,
      autoRefresh: true, // Opción por defecto
      fetchParams: null,

      fetchWeather: async (params) => {
        set(
          produce((state) => {
            state.loading = true;
            state.error = ErrorInitialState;
            state.fetchParams = params;
          }),
        );

        try {
          const result = await fetchWeather(params);

          if ("error" in (result as FetchError)) {
            set(
              produce((state) => {
                state.error = result as FetchError;
                state.loading = false;
              }),
            );
            return;
          }

          const data = result as StructureWeatherData;
          set(
            produce((state) => {
              state.data = data;
              state.loading = false;
              state.error = null;
            }),
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido.";

          set(
            produce((state) => {
              state.error = {
                error: errorMessage,
                type: MessageType.WARNING,
                errorType: ErrorType.UNKNOWN_ERROR,
                status: 0, // Status 0 para errores desconocidos
              };
              state.loading = false;
            }),
          );
        }
      },

      isLoading: () => get().loading,
      hasError: () => get().error !== null,
      getError: () => get().error,
      clearError: () =>
        set(
          produce((state) => {
            state.error = null;
          }),
        ),

      setAutoRefresh: (value) => {
        set({ autoRefresh: value });
        if (value) get().scheduleAutoRefresh();
      },

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
          get().scheduleAutoRefresh(); // Reprogramar para la próxima medianoche
        }, timeToMidnight);
      },

      getAllWeatherData: () => get().data,
      getCurrentDayWeather: () => get().data?.currentDay || null,
      getPastDayWeather: () => get().data?.pastDay || null,
      getForecastWeather: () => get().data?.forecast || null,
      getCurrentHourWeather() {
        const { data } = get();
        if (!data) return null;

        const timezone = data.timezone;

        // Obtener la hora actual en la zona horaria del usuario
        const currentDate = new Date().toLocaleString("es-ES", {
          timeZone: timezone,
        });
        // Convertir la fecha a un objeto Date
        const currentHour = new Date(currentDate);

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
      name: "weather-store", // nombre de la store en el almacenamiento local
    },
  ),
);

/**
 * Programar la actualización automática si está habilitada
 * Se ejecuta al cargar la aplicación
 */
if (useWeatherStore.getState().autoRefresh) {
  useWeatherStore.getState().scheduleAutoRefresh();
}
