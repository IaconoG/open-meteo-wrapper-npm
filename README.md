# @i-giann/open-meteo-wrapper

Un wrapper completo para la API de Open-Meteo que proporciona hooks de React y servicios reutilizables para obtener datos meteorológicos.

## 🌟 Características

- ✅ **Hook de React optimizado** con caché automático
- ✅ **Servicio puro** sin dependencias de React
- ✅ **TypeScript completo** con tipos seguros
- ✅ **Dos modos de consulta**: `forecast_length` y `time_interval`
- ✅ **Caché inteligente** para optimizar las llamadas a la API
- ✅ **Manejo de errores robusto**
- ✅ **Auto-refresh programable**
- ✅ **Zero configuración** - funciona out-of-the-box

## 📦 Instalación

```bash
npm install @i-giann/open-meteo-wrapper
```

## 🚀 Uso Rápido

### Con React Hook (Recomendado - Type Safe)

```typescript
import { useWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

function WeatherComponent() {
  const { data, isLoading, error, fetchWeather } = useWeather();

  useEffect(() => {
    fetchWeather({
      latitude: 40.7128,
      longitude: -74.006,
      hourly: [HourlyParams.Temperature, HourlyParams.WeatherCode],
      daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
    });
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.error}</div>;

  return (
    <div>
      <h1>Clima Actual</h1>
      <p>Temperatura: {data?.currentDay?.temperatureMax?.value}°C</p>
    </div>
  );
}
```

### Con Servicio Puro (Type Safe)

```typescript
import {
  fetchWeather,
  HourlyParams,
  DailyParams,
} from "@i-giann/open-meteo-wrapper";

async function getWeatherData() {
  const result = await fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
    hourly: [HourlyParams.Temperature, HourlyParams.RelativeHumidity],
    daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
  });

  if ("error" in result) {
    console.error("Error:", result.error);
    return;
  }

  console.log("Datos meteorológicos:", result);
}
```

### Con Time Interval

```typescript
import {
  fetchWeather,
  WeatherQueryMode,
  CurrentParams,
  HourlyParams,
  DailyParams,
} from "@i-giann/open-meteo-wrapper";

const result = await fetchWeather({
  latitude: 40.7128,
  longitude: -74.006,
  mode: WeatherQueryMode.TimeInterval,
  start_date: "2025-01-01",
  end_date: "2025-01-07",
  current: [CurrentParams.WeatherCode, CurrentParams.Temperature],
  hourly: [HourlyParams.Temperature, HourlyParams.WeatherCode],
  daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
});
```

## 📋 API Reference

### useWeather Hook

```typescript
const {
  data, // Datos meteorológicos estructurados
  currentDay, // Datos del día actual
  pastDays, // Datos de días pasados
  forecast, // Pronóstico futuro
  currentHour, // Datos de la hora actual
  isLoading, // Estado de carga
  error, // Error si existe
  fetchWeather, // Función para obtener datos
  setAutoRefresh, // Configurar auto-refresh
  clearError, // Limpiar errores
} = useWeather();
```

### fetchWeather Service

```typescript
const result = await fetchWeather({
  latitude: number,        // Latitud (requerido)
  longitude: number,       // Longitud (requerido)
  hourly?: HourlyParams[], // Parámetros por hora
  daily?: DailyParams[],   // Parámetros diarios
  current?: CurrentParams[], // Parámetros current
  timezone?: string,       // Zona horaria
  mode?: WeatherQueryMode,  // forecast_length por defecto
  past_days?: number,       // Días pasados (modo forecast_length)
  forecast_days?: number,   // Días de pronóstico (modo forecast_length)
  start_date?: string,      // Inicio del intervalo (modo time_interval)
  end_date?: string         // Fin del intervalo (modo time_interval)
});
```

Cuando se usa `time_interval`, el servicio consulta la API con `start_date` y `end_date` y mantiene la forma de retorno actual. En ese caso, `currentDay` sigue apuntando al primer día del intervalo y `pastDay` queda vacío.

## 🎯 Parámetros Disponibles

### Parámetros Horarios (HourlyParams)

- `temperature_2m` - Temperatura a 2m
- `relative_humidity_2m` - Humedad relativa
- `weather_code` - Código meteorológico WMO
- `wind_speed_10m` - Velocidad del viento
- `wind_gusts_10m` - Ráfagas de viento
- `surface_pressure` - Presión superficial
- `showers` - Chubascos
- `precipitation` - Precipitación
- Y muchos más...

### Parámetros Diarios (DailyParams)

- `temperature_2m_max` - Temperatura máxima
- `temperature_2m_min` - Temperatura mínima
- `apparent_temperature_max` - Sensación térmica máxima
- `apparent_temperature_min` - Sensación térmica mínima
- `precipitation_sum` - Precipitación acumulada
- `rain_sum` - Lluvia acumulada
- `snowfall_sum` - Nieve acumulada
- `weather_code` - Código meteorológico diario
- `sunrise` - Hora de salida del sol
- `sunset` - Hora de puesta del sol
- `sunshine_duration` - Duración de sol
- `wind_speed_10m_max` - Velocidad máxima del viento
- `wind_gusts_10m_max` - Ráfagas máximas

### Parámetros Current (CurrentParams)

- `weather_code` - Código meteorológico actual
- `temperature_2m` - Temperatura actual
- `relative_humidity_2m` - Humedad relativa actual
- `apparent_temperature` - Sensación térmica actual
- `wind_speed_10m` - Velocidad actual del viento
- `wind_direction_10m` - Dirección actual del viento
- `wind_gusts_10m` - Ráfagas actuales
- `cloud_cover` - Cobertura de nubes
- `is_day` - Indicador de día/noche
- `precipitation`, `rain`, `snowfall`, `showers` - Precipitación actual
- `surface_pressure`, `pressure_msl` - Presión actual

## 🔧 Configuración Avanzada

### Auto-refresh

```typescript
const { setAutoRefresh } = useWeather();
setAutoRefresh(true); // Actualización automática a medianoche
```

### Caché personalizado

El hook incluye caché inteligente de 10 minutos por defecto.

## ✅ Best Practices

### 1. Usa enums para type safety

✅ **Correcto** - Con autocomplete y tipado estricto:

```typescript
import { HourlyParams } from "@i-giann/open-meteo-wrapper";
fetchWeather({
  hourly: [HourlyParams.Temperature, HourlyParams.Precipitation],
});
```

### 2. Manejo de errores

```typescript
const result = await fetchWeather({ latitude: 0, longitude: 0 });

if ("error" in result) {
  console.error(`${result.type}: ${result.error}`);
  return;
}

console.log("Datos obtenidos:", result);
```

### 3. Parámetros opcionales

```typescript
fetchWeather({
  latitude: 40.7128,
  longitude: -74.006,
  timezone: "America/New_York", // Por defecto: America/Sao_Paulo
  past_days: 1, // Datos históricos
  forecast_days: 7, // Pronóstico a futuro
});
```

### 4. Elegir el modo adecuado

```typescript
fetchWeather({
  latitude: 40.7128,
  longitude: -74.006,
  mode: WeatherQueryMode.ForecastLength,
  past_days: 0,
  forecast_days: 7,
});

fetchWeather({
  latitude: 40.7128,
  longitude: -74.006,
  mode: WeatherQueryMode.TimeInterval,
  start_date: "2025-01-01",
  end_date: "2025-01-07",
});
```

## 🌍 Ejemplos Completos

Visita la carpeta `docs/` para ejemplos completos y casos de uso avanzados.

## 📄 Licencia

MIT

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request.
