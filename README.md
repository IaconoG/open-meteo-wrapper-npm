# @i-giann/open-meteo-wrapper

Un wrapper completo para la API de Open-Meteo que proporciona hooks de React y servicios reutilizables para obtener datos meteorológicos.

## 🌟 Características

- ✅ **Hook de React optimizado** con caché automático
- ✅ **Servicio puro** sin dependencias de React
- ✅ **TypeScript completo** con tipos seguros
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
import { fetchWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

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
  timezone?: string,       // Zona horaria
  past_days?: number,      // Días pasados
  forecast_days?: number   // Días de pronóstico
});
```

## 🎯 Parámetros Disponibles

### Parámetros Horarios (HourlyParams)

- `temperature_2m` - Temperatura a 2m
- `relative_humidity_2m` - Humedad relativa
- `weather_code` - Código meteorológico WMO
- `wind_speed_10m` - Velocidad del viento
- `precipitation` - Precipitación
- Y muchos más...

### Parámetros Diarios (DailyParams)

- `temperature_2m_max` - Temperatura máxima
- `temperature_2m_min` - Temperatura mínima
- `sunrise` - Hora de salida del sol
- `sunset` - Hora de puesta del sol

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

## 🌍 Ejemplos Completos

Visita la carpeta `docs/` para ejemplos completos y casos de uso avanzados.

## 📄 Licencia

MIT

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request.
