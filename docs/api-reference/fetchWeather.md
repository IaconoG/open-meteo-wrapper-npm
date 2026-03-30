# API Reference - Open Meteo Wrapper

## Services

### `fetchWeather`

El servicio `fetchWeather` permite obtener datos meteorológicos de la API Open-Meteo de manera programática. Este servicio es útil cuando se necesita obtener datos meteorológicos sin utilizar hooks.

#### Parámetros:

El servicio recibe un objeto con los siguientes parámetros:

<!-- prettier-ignore-start -->
| Nombre         | Tipo                | Descripción                                                                 |
|----------------|---------------------|-----------------------------------------------------------------------------|
| `latitude`     | `number`            | Latitud de la ubicación de la que se desean obtener los datos meteorológicos.|
| `longitude`    | `number`            | Longitud de la ubicación de la que se desean obtener los datos meteorológicos.|
| `hourly`       | `HourlyParams[]`    | (Opcional) Parámetros por hora. Valor por defecto: `temperature_2m`, `weather_code`.|
| `daily`        | `DailyParams[]`     | (Opcional) Parámetros por día. Valor por defecto: `temperature_2m_max`, `temperature_2m_min`.|
| `timezone`     | `string`            | (Opcional) Zona horaria. Valor por defecto: `America/Sao_Paulo`.|
| `past_days`    | `number`            | (Opcional) Días pasados. Valor por defecto: `0`.|
| `forecast_days`| `number`            | (Opcional) Días de pronóstico. Valor por defecto: `7`.|
<!-- prettier-ignore-end -->

#### Retorno:

El servicio devuelve una promesa que resuelve en un objeto con los datos meteorológicos obtenidos.

#### Ejemplo de uso:

```javascript
import { fetchWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

const getWeatherData = async () => {
  try {
    const data = await fetchWeather({
      latitude: 40.7128,
      longitude: -74.006,
      hourly: [HourlyParams.Temperature, HourlyParams.Precipitation],
      daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
    });
    console.log(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

getWeatherData();
```

```typescript
import {
  fetchWeather,
  HourlyParams,
  DailyParams,
  StructureWeatherData,
} from "@i-giann/open-meteo-wrapper";

const getWeatherData = async (): Promise<void> => {
  try {
    const data: StructureWeatherData = await fetchWeather({
      latitude: 40.7128,
      longitude: -74.006,
      hourly: [HourlyParams.Temperature, HourlyParams.WeatherCode],
      daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
    });
    console.log(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

getWeatherData();
```

> **Nota:** En ambos ejemplos, si solo se pasan la latitud y longitud, se utilizarán parámetros predefinidos para obtener los datos meteorológicos.

### Ejemplo de uso con más parámetros (Recomendado - Type Safe):

```typescript
import {
  fetchWeather,
  HourlyParams,
  DailyParams,
  StructureWeatherData,
} from "@i-giann/open-meteo-wrapper";

const getWeatherData = async (): Promise<void> => {
  try {
    const data: StructureWeatherData = await fetchWeather({
      latitude: 40.7128,
      longitude: -74.006,
      hourly: [
        HourlyParams.Temperature,
        HourlyParams.Precipitation,
        HourlyParams.RelativeHumidity,
        HourlyParams.WindSpeed,
        HourlyParams.WeatherCode,
      ],
      daily: [
        DailyParams.TemperatureMax,
        DailyParams.TemperatureMin,
        DailyParams.Sunrise,
        DailyParams.Sunset,
      ],
      timezone: "America/New_York",
      past_days: 2,
      forecast_days: 7,
    });
    console.log(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

getWeatherData();
```
