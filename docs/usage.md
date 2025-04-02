# Uso de Open Meteo Wrapper

## Informacion sobre el hook `useWeather`

`useWeather` nos permite obtener datos meteorológicos de la API Open-Meteo. El hook utiliza un almacenamiento global con Zustand para almacenar los datos meteorológicos. Utilizando `useWeather`, podemos acceder a los datos meteorológicos y a la función `fetchWeather` para obtener nuevos datos.

### Uso Avanzado con `useWeather`

```typescript
import { useWeather } from "@giann/open-meteo-wrapper";

function WeatherComponent() {
  const { weatherData, fetchWeather } = useWeather();

  return (
    <div>
      <button
        onClick={() => fetchWeather({ latitude: 40.7128, longitude: -74.006 })}
      >
        Obtener Clima
      </button>
      {weatherData && (
        <div>
          <p>Temperatura: {weatherData.temperature}°C</p>
          <p>Condición: {weatherData.condition}</p>
        </div>
      )}
    </div>
  );
}
```

## Informacion sobre el servicio `fetchWeather`

`fetchWeather` es un servicio que permite obtener datos meteorológicos de la API Open-Meteo. Este servicio acepta parámetros como `latitude`, `longitude`, `hourly`, `daily`, `timezone`, `past_days` y `forecast_days`. Estos parámetros son opcionales y permiten personalizar la consulta a la API.
El servicio devuelve un objeto con los datos meteorológicos obtenidos de la API.

### Uso Avanzado con `fetchWeather`

Estos ejemplos muestran cómo configurar parámetros opcionales y la estructura de la salida esperada.

#### Ejemplo 1: Parámetros básicos

```typescript
import { fetchWeather } from "@giann/open-meteo-wrapper";

async function getBasicWeather() {
  const weatherData = await fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
  });
  console.log(weatherData);
}

getBasicWeather();
```

Salida esperada:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "current_weather": {
    "temperature": 15,
    "condition": "Clear"
  }
}
```

#### Ejemplo 2: Parámetros opcionales

```typescript
import { fetchWeather } from "@giann/open-meteo-wrapper";

async function getWeatherWithOptions() {
  const weatherData = await fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
    hourly: ["temperature_2m", "precipitation"],
    daily: ["temperature_2m_max", "temperature_2m_min"],
    timezone: "America/New_York",
  });
  console.log(weatherData);
}

getWeatherWithOptions();
```

Salida esperada:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "hourly": {
    "temperature_2m": [10, 12, 14],
    "precipitation": [0, 0.1, 0]
  },
  "daily": {
    "temperature_2m_max": [15],
    "temperature_2m_min": [5]
  },
  "timezone": "America/New_York"
}
```
