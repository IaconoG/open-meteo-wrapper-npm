import { useCallback, useEffect, useMemo } from "react";
import { useWeatherStore } from "../store/useWeatherStore";
import { FetchWeatherProps } from "../types/weatherTypes";

/**
 * Hook personalizado para el manejo de los datos meteorológicos.
 * Proporciona una interfaz React simplificada y adaptada a la nueva estructura del parser.
 *
 * @returns {object} Datos meteorológicos principales, estado y acciones útiles
 */
export const useWeather = () => {
  const store = useWeatherStore();

  /**
   * Acción para solicitar datos meteorológicos con los parámetros dados.
   * Memoizada para evitar renders innecesarios.
   */
  const fetchWeather = useCallback(
    async (params: FetchWeatherProps) => {
      await store.fetchWeather(params);
    },
    [store.fetchWeather]
  );

  /**
   * Inicializa la actualización automática al montar el componente si está activa.
   */
  useEffect(() => {
    if (store.autoRefresh && store.fetchParams) {
      store.scheduleAutoRefresh();
    }
  }, [store.autoRefresh, store.fetchParams]);

  /**
   * Memoiza los datos y el estado para evitar renders innecesarios en React.
   * Solo depende de los datos base del store para mayor eficiencia.
   */
  const memoizedData = useMemo(
    () => ({
      // Datos meteorológicos principales
      data: store.data,
      currentDay: store.data?.currentDay || null,
      pastDays: store.data?.pastDay || null,
      forecast: store.data?.forecast || null,
      currentHour: store.getCurrentHourWeather(),

      // Estado
      isLoading: store.loading,
      error: store.error,
    }),
    [store.data, store.loading, store.error]
  );

  return {
    ...memoizedData,
    /** Acción para solicitar datos meteorológicos */
    fetchWeather,
    /** Activa o desactiva la actualización automática */
    setAutoRefresh: store.setAutoRefresh,
    /** Limpia el error actual */
    clearError: store.clearError,
  };
};
