# Uso de Open Meteo Wrapper

## Información sobre el hook `useWeather`

`useWeather` nos permite obtener datos meteorológicos de la API Open-Meteo. El hook utiliza un almacenamiento global con Zustand para almacenar los datos meteorológicos. Utilizando `useWeather`, podemos acceder a los datos meteorológicos y a la función `fetchWeather` para obtener nuevos datos.

### Uso Avanzado con `useWeather` (Type Safe con Enums)

```typescript
import { useWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

function WeatherComponent() {
  const { data, isLoading, error, fetchWeather } = useWeather();

  const handleFetchWeather = async () => {
    await fetchWeather({
      latitude: 40.7128,
      longitude: -74.006,
      hourly: [
        HourlyParams.Temperature,
        HourlyParams.Precipitation,
        HourlyParams.WindSpeed,
      ],
      daily: [
        DailyParams.TemperatureMax,
        DailyParams.TemperatureMin,
        DailyParams.Sunrise,
        DailyParams.Sunset,
      ],
    });
  };

  return (
    <div>
      <button onClick={handleFetchWeather} disabled={isLoading}>
        {isLoading ? "Cargando..." : "Obtener Clima"}
      </button>
      {error && (
        <div style={{ color: "red" }}>
          Error ({error.type}): {error.error}
        </div>
      )}
      {data && (
        <div>
          <p>Temperatura: {data.currentDay.temperatureMax?.value}°C</p>
          <p>Condición: {data.currentDay.description?.value}</p>
        </div>
      )}
    </div>
  );
}
```

## Información sobre el servicio `fetchWeather`

`fetchWeather` es un servicio que permite obtener datos meteorológicos de la API Open-Meteo. Este servicio acepta parámetros como `latitude`, `longitude`, `hourly`, `daily`, `timezone`, `past_days` y `forecast_days`. Estos parámetros son opcionales y permiten personalizar la consulta a la API.
El servicio devuelve un objeto con los datos meteorológicos obtenidos de la API.

### Uso Avanzado con `fetchWeather` (Type Safe con Enums)

Estos ejemplos muestran cómo configurar parámetros opcionales y la estructura de la salida esperada.

#### Ejemplo 1: Parámetros básicos

```typescript
import { fetchWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

async function getBasicWeather() {
  const weatherData = await fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
    hourly: [HourlyParams.Temperature, HourlyParams.WeatherCode],
    daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
  });

  if ("error" in weatherData) {
    console.error("Error:", weatherData.error);
    return;
  }

  console.log(weatherData);
}

getBasicWeather();
```

Salida esperada:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "currentDay": {
    "temperatureMax": { "value": 25, "unit": "°C" },
    "temperatureMin": { "value": 18, "unit": "°C" }
  }
}
```

#### Ejemplo 2: Parámetros opcionales con enums

```typescript
import { fetchWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

async function getWeatherWithOptions() {
  const weatherData = await fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
    hourly: [
      HourlyParams.Temperature,
      HourlyParams.Precipitation,
      HourlyParams.RelativeHumidity,
      HourlyParams.WindSpeed,
    ],
    daily: [
      DailyParams.TemperatureMax,
      DailyParams.TemperatureMin,
      DailyParams.Sunrise,
      DailyParams.Sunset,
    ],
    timezone: "America/New_York",
    past_days: 1,
  });

  if ("error" in weatherData) {
    console.error("Error:", weatherData.error);
    return;
  }

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
