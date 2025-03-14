# API Reference - Open Meteo Wrapper

## Store

### `useWeatherStore`

El store `useWeatherStore` permite almacenar y acceder a los datos meteorológicos de manera eficiente. Utiliza Zustand para manejar el estado global de los datos meteorológicos. Además, el store persiste la información almacenada utilizando `zustand/middleware` y `immer` para producir cambios inmutables en el estado.

La información almacenada en el store se persiste en el almacenamiento local del navegador, lo que permite que los datos meteorológicos estén disponibles incluso después de recargar la página.

### Estado del store:

El estado del store `useWeatherStore` incluye las siguientes propiedades:

<!-- prettier-ignore-start -->
| Nombre        | Tipo                           | Descripción  |
| ------------- | ------------------------------ | ------------------------------------------------- | 
| `data`        | `StructureWeatherData \| null` | Los datos meteorológicos obtenidos de la API Open-Meteo. |
| `loading`     | `boolean`                      | Indica si se está realizando una solicitud para obtener datos meteorológicos. |
| `error`       | `FetchError \| null`           | Contiene información sobre cualquier error ocurrido durante la solicitud de datos meteorológicos. |
| `autoRefresh` | `boolean`                      | Indica si la actualización automática de los datos meteorológicos está habilitada. |
| `fetchParams` | `FetchWeatherProps \| null` | Los parámetros utilizados para la última solicitud de datos meteorológicos. |
| `lastFetchTime` | `number \| null` | La hora de la última solicitud de datos meteorológicos. |
| `cacheDuration` | `number` | La duración de la caché en milisegundos. |
<!-- prettier-ignore-end -->

### Acciones del store:

El store `useWeatherStore` proporciona las siguientes acciones para interactuar con el estado:

<!-- prettier-ignore-start -->
| Nombre                  | Tipo                                           | Descripción                                      |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `fetchWeather`          | `(params: FetchWeatherProps) => Promise<void>` | Realiza una solicitud para obtener datos meteorológicos según los parámetros proporcionados. |
| `isLoading`             | `() => boolean`                                | Verifica si se está realizando una solicitud para obtener datos meteorológicos. |
| `hasError`              | `() => boolean`                                | Verifica si ocurrió un error durante la solicitud de datos meteorológicos. |
| `getError`              | `() => FetchError \| null`                     | Obtiene la información del error ocurrido durante la solicitud de datos meteorológicos. |
| `clearError`            | `() => void`                                   | Limpia la información del error en el estado del store. |
| `setAutoRefresh`        | `(value: boolean) => void`                     | Habilita o deshabilita la actualización automática de los datos meteorológicos. |
| `scheduleAutoRefresh`   | `() => void`                                   | Programa la actualización automática de los datos meteorológicos. |
| `getAllWeatherData`     | `() => StructureWeatherData \| null`           | Obtiene todos los datos meteorológicos almacenados en el estado del store. |
| `getCurrentDayWeather`  | `() => DailyWeatherData \| null`               | Obtiene los datos meteorológicos del día actual. |
| `getPastDayWeather`     | `() => DailyWeatherData[] \| null`             | Obtiene los datos meteorológicos de días pasados. |
| `getForecastWeather`    | `() => DailyWeatherData[] \| null`             | Obtiene los datos meteorológicos del pronóstico. |
| `getCurrentHourWeather` | `() => HourlyWeatherData \| null`              | Obtiene los datos meteorológicos de la hora actual. |
<!-- prettier-ignore-end -->

#### `fetchWeather`

La acción `fetchWeather` realiza una solicitud para obtener datos meteorológicos según los parámetros proporcionados. Si ya se hizo una solicitud previa con los mismos parámetros, se omite la llamada para evitar peticiones redundantes. Actualiza el estado del store con los datos obtenidos o con un error si la solicitud falla.

```typescript
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
```

#### `isLoading`

La acción `isLoading` verifica si se está realizando una solicitud para obtener datos meteorológicos. Devuelve `true` si una solicitud está en curso, de lo contrario, devuelve `false`.

```typescript
isLoading: () => get().loading,
```

#### `hasError`

La acción `hasError` verifica si ocurrió un error durante la solicitud de datos meteorológicos. Devuelve `true` si hay un error, de lo contrario, devuelve `false`.

```typescript
hasError: () => get().error !== null,
```

#### `getError`

La acción `getError` obtiene la información del error ocurrido durante la solicitud de datos meteorológicos. Devuelve un objeto `FetchError` con los detalles del error o `null` si no hay error.

```typescript
getError: () => get().error,
```

#### `clearError`

La acción `clearError` limpia la información del error en el estado del store. Esta función se utiliza para restablecer el estado de error después de manejarlo.

```typescript
clearError: () =>
  set(
    produce((state) => {
      state.error = null;
    }),
  ),
```

#### `setAutoRefresh`

La acción `setAutoRefresh` habilita o deshabilita la actualización automática de los datos meteorológicos. Recibe un valor booleano que indica si la actualización automática debe estar habilitada o deshabilitada. Al activarse, programa una llamada a `scheduleAutoRefresh()`.

```typescript
setAutoRefresh: (value) => {
  set({ autoRefresh: value });
  if (value) get().scheduleAutoRefresh();
},
```

#### `scheduleAutoRefresh`

La acción `scheduleAutoRefresh` programa una actualización automática diaria de los datos meteorológicos, calculando el tiempo restante para la próxima medianoche en la zona horaria del usuario. Al cumplirse el intervalo, vuelve a llamar a `fetchWeather` y reprograma la actualización para el siguiente día.

```typescript
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
```

#### `getAllWeatherData`

La acción `getAllWeatherData` obtiene todos los datos meteorológicos almacenados en el estado del store. Devuelve un objeto `StructureWeatherData` con los datos o `null` si no hay datos disponibles.

```typescript
getAllWeatherData: () => get().data,
```

#### `getCurrentDayWeather`

La acción `getCurrentDayWeather` obtiene los datos meteorológicos del día actual. Devuelve un objeto `DailyWeatherData` con los datos del día actual o `null` si no hay datos disponibles.

```typescript
getCurrentDayWeather: () => get().data?.currentDay || null,
```

#### `getPastDayWeather`

La acción `getPastDayWeather` obtiene los datos meteorológicos de días pasados. Devuelve un array de objetos `DailyWeatherData` con los datos de días pasados o `null` si no hay datos disponibles.

```typescript
getPastDayWeather: () => get().data?.pastDay || null,
```

#### `getForecastWeather`

La acción `getForecastWeather` obtiene los datos meteorológicos del pronóstico. Devuelve un array de objetos `DailyWeatherData` con los datos del pronóstico o `null` si no hay datos disponibles.

```typescript
getForecastWeather: () => get().data?.forecast || null,
```

#### `getCurrentHourWeather`

La acción `getCurrentHourWeather` obtiene los datos meteorológicos de la hora actual. Devuelve un objeto `HourlyWeatherData` con los datos de la hora actual o `null` si no hay datos disponibles.

```typescript
getCurrentHourWeather() {
  const { data } = get();
  if (!data) return null;

  const timezone = data.timezone;
  const currentLocaleString = new Date().toLocaleString("es-ES", {
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
```

### Funciones de utilidad

#### `areFetchParamsEqual`

La función `areFetchParamsEqual` compara dos objetos de parámetros de solicitud para determinar si son iguales. Este método se utiliza para evitar solicitudes redundantes si los parámetros no han cambiado.

```typescript
function areFetchParamsEqual(
  a: FetchWeatherProps,
  b: FetchWeatherProps,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
```

### Variables de caché

Estas variables se utilizan en la acción `fetchWeather` para determinar si se pueden usar datos en caché en lugar de hacer una nueva solicitud.

- `lastFetchTime`: Almacena la hora de la última solicitud de datos meteorológicos.
- `cacheDuration`: Define la duración de la caché en milisegundos (por defecto, 10 minutos).

```typescript
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
```
