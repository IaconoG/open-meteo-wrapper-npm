# Guía de Actualización

## v1.0.0 → v1.0.1

### ¿Qué cambió?

En v1.0.1, se exportan los enums (`HourlyParams`, `DailyParams`, `MessageType`, `ErrorType`) como **valores reales en runtime**, no solo como tipos TypeScript.

### ¿Por qué importa?

En v1.0.0, los enums se exportaban como type-only exports, lo que causaba errores en runtime:

```typescript
// ❌ v1.0.0 - FALLA EN RUNTIME
import { HourlyParams } from "@i-giann/open-meteo-wrapper";

fetchWeather({
  hourly: [HourlyParams.Temperature], // ReferenceError: HourlyParams is not defined
});
```

En v1.0.1, los enums funcionan correctamente:

```typescript
// ✅ v1.0.1 - FUNCIONA
import { HourlyParams } from "@i-giann/open-meteo-wrapper";

fetchWeather({
  hourly: [HourlyParams.Temperature], // ✓ Funciona perfectamente
});
```

### Cómo actualizar

1. **Actualiza el paquete:**

```bash
npm update @i-giann/open-meteo-wrapper
# o
npm install @i-giann/open-meteo-wrapper@latest
```

2. **Actualiza tu código para usar enums**:

```typescript
import { fetchWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

fetchWeather({
  latitude: 40.7128,
  longitude: -74.006,
  hourly: [HourlyParams.Temperature, HourlyParams.Precipitation],
  daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
});
```

### Beneficios de actualizar

| Aspecto | v1.0.0 | v1.0.1 |
|---------|--------|--------|
| **Enums en runtime** | ❌ No | ✅ Sí |
| **Type safety** | ⚠️ Parcial | ✅ Completo |
| **Autocomplete IDE** | ⚠️ Solo tipos | ✅ Completo |
| **Validación en tiempo compilación** | ❌ No | ✅ Sí |
| **Errores en runtime** | ❌ Posibles | ✅ Imposibles |

### Compatibilidad

⚠️ **Se requiere actualización de código para evitar errores en runtime.**

- Migra `hourly` y `daily` para usar `HourlyParams` y `DailyParams`.
- Evita usar strings literales en ejemplos y código nuevo.
- La forma recomendada y soportada es con enums exportados.

### Enums disponibles

#### `HourlyParams`

```typescript
import { HourlyParams } from "@i-giann/open-meteo-wrapper";

// Todos estos están disponibles como autocomplete:
HourlyParams.Temperature
HourlyParams.RelativeHumidity
HourlyParams.DewPoint
HourlyParams.ApparentTemperature
HourlyParams.PrecipitationProbability
HourlyParams.Precipitation
HourlyParams.Rain
HourlyParams.Snowfall
HourlyParams.SnowDepth
HourlyParams.WeatherCode
HourlyParams.PressureMsl
HourlyParams.CloudCover
HourlyParams.Visibility
HourlyParams.WindSpeed
HourlyParams.WindDirection
HourlyParams.UvIndex
HourlyParams.IsDay
```

#### `DailyParams`

```typescript
import { DailyParams } from "@i-giann/open-meteo-wrapper";

DailyParams.TemperatureMax
DailyParams.TemperatureMin
DailyParams.Sunrise
DailyParams.Sunset
DailyParams.DaylightDuration
```

#### `MessageType`

```typescript
import { MessageType } from "@i-giann/open-meteo-wrapper";

MessageType.SUCCESS   // "success"
MessageType.ERROR     // "error"
MessageType.WARNING   // "warning"
MessageType.INFO      // "info"
```

#### `ErrorType`

```typescript
import { ErrorType } from "@i-giann/open-meteo-wrapper";

ErrorType.NETWORK_ERROR // "network_error"
ErrorType.API_ERROR     // "api_error"
ErrorType.DATA_ERROR    // "data_error"
ErrorType.UNKNOWN_ERROR // "unknown_error"
```

### Ejemplos de migración

#### Ejemplo 1: Hook de React

```typescript
import { useWeather, HourlyParams, DailyParams } from "@i-giann/open-meteo-wrapper";

useEffect(() => {
  fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
    hourly: [HourlyParams.Temperature, HourlyParams.WeatherCode],
    daily: [DailyParams.TemperatureMax, DailyParams.TemperatureMin],
  });
}, []);
```

#### Ejemplo 2: Servicio puro

```typescript
import { fetchWeather, HourlyParams } from "@i-giann/open-meteo-wrapper";

const result = await fetchWeather({
  latitude: 40.7128,
  longitude: -74.006,
  hourly: [HourlyParams.Temperature, HourlyParams.Precipitation],
});
```

#### Ejemplo 3: Manejo de errores

```typescript
// ❌ Antes (sin tipos para ErrorType)
if ("error" in result) {
  console.error(`Error: ${result.error}`);
}

// ✅ Después (con tipos de error)
import { ErrorType } from "@i-giann/open-meteo-wrapper";

if ("error" in result) {
  if (result.errorType === ErrorType.NETWORK_ERROR) {
    console.error("Problema de conexión");
  } else if (result.errorType === ErrorType.API_ERROR) {
    console.error("Error de la API de Open-Meteo");
  }
}
```

### Preguntas frecuentes

**P: ¿Es obligatorio actualizar a v1.0.1?**

R: Sí, es la versión recomendada para evitar errores en runtime y usar enums correctamente en `hourly` y `daily`.

**P: ¿Perderé compatibilidad si actualizo?**

R: Debes migrar a enums en `hourly` y `daily` para evitar errores en runtime y mantener tipado correcto.

**P: ¿Hay cambios de API?**

R: No cambian las funciones públicas, pero sí se corrige el modo de exportación de enums para su uso en runtime.

**P: ¿Debo cambiar todos mis strings literales a enums?**

R: Sí, se recomienda migrar completamente a enums para evitar inconsistencias y errores en runtime.

### Soporte

Si tienes problemas durante la actualización, abre un issue en:
https://github.com/IaconoG/open-meteo-wrapper-npm/issues
