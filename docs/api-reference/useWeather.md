# API Reference - Open Meteo Wrapper

## Hooks

### `useWeather`

El hook `useWeather` permite manejar datos meteorológicos obtenidos de la API Open-Meteo. Utiliza un estado global `useStoreWeather` mediante Zustand para almacenar y acceder a los datos meteorológicos de manera eficiente.

- Obten mas información sobre el uso del store [useWeatherStore](./useWeatherStore.md).

#### Retorno del hook:

El hook devuelve un objeto con las siguientes funciones y propiedades:

<!-- prettier-ignore-start -->
| Nombre                  | Tipo                                           | Descripción                                        |
| ----------------------- | ---------------------------------------------- | -------------------------------------------------- |
| `fetchWeather`          | `(params: FetchWeatherProps) => Promise<void>` | Obtiene datos meteorológicos según los parámetros indicados. |
| `getAllWeatherData`     | `() => StructureWeatherData \| null`           | Retorna todos los datos meteorológicos obtenidos. |
| `getCurrentDayWeather`  | `() => DailyWeatherData \| null`               | Retorna los datos meteorológicos del día actual.  |
| `getPastDayWeather`     | `() => DailyWeatherData[] \| null`             | Retorna los datos meteorológicos de días pasados. |
| `getForecastWeather`    | `() => DailyWeatherData[] \| null`             | Retorna el pronóstico del tiempo para los próximos días. |
| `getCurrentHourWeather` | `() => HourlyWeatherData \| null`              | Retorna los datos meteorológicos de la hora actual. |
| `isLoading`             | `() => boolean`                                | Indica si la solicitud de datos meteorológicos está en curso. |
| `hasError`              | `() => boolean`                                | Indica si ocurrió un error en la solicitud de datos. |
| `getError`              | `() => FetchError \| null`                     | Retorna el error ocurrido en la solicitud de datos, si existe. |
| `setAutoRefresh`        | `(value: boolean) => void`                     | Habilita o deshabilita la actualización automática de los datos meteorológicos. |
<!-- prettier-ignore-end -->

#### Ejemplo de uso:

```tsx
import { useWeather } from "@giann/open-meteo-wrapper";
import { useEffect } from "react";

const WeatherComponent = () => {
  const {
    fetchWeather,
    getAllWeatherData,
    getCurrentDayWeather,
    isLoading,
    hasError,
    getError,
  } = useWeather();

  useEffect(() => {
    fetchWeather({ latitude: 40.7128, longitude: -74.006 });
  }, []);

  if (isLoading()) return <div>Cargando...</div>;
  if (hasError()) return <div>Error: {getError()?.message}</div>;

  return (
    <div>
      <h1>Clima actual</h1>
      <pre>{JSON.stringify(getCurrentDayWeather(), null, 2)}</pre>
    </div>
  );
};

export default WeatherComponent;
```

> **Nota:** Este hook centraliza el acceso a los datos meteorológicos y evita múltiples llamadas innecesarias a la API, asegurando una mejor eficiencia en la aplicación.
