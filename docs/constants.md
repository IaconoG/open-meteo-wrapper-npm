# Constantes

### BASE_URL

`BASE_URL`: URL base para las solicitudes de datos meteorológicos.

| Clave    | Valor                                  | Descripción                                            |
| -------- | -------------------------------------- | ------------------------------------------------------ |
| BASE_URL | https://api.open-meteo.com/v1/forecast | URL base para las solicitudes de datos meteorológicos. |

```typescript
const BASE_URL = "https://api.open-meteo.com/v1/forecast";
```

### WEATHER_CONSTANTS

`WEATHER_CONSTANTS`: Objeto que contiene las constantes utilizadas para las solicitudes de datos meteorológicos.

| Clave                 | Valor                                       | Descripción                          |
| --------------------- | ------------------------------------------- | ------------------------------------ |
| DEFAULT_TIMEZONE      | "America/Sao_Paulo"                         | Zona horaria por defecto.            |
| DEFAULT_HOURLY_VALUE  | ["temperature_2m", "weather_code"]          | Parámetros predeterminados por hora. |
| DEFAULT_DAILY_VALUE   | ["temperature_2m_max","temperature_2m_min"] | Parámetros predeterminados por día.  |
| DEFAULT_PAST_DAYS     | 0                                           | Días pasados por defecto.            |
| DEFAULT_FORECAST_DAYS | 7                                           | Días de pronóstico por defecto.      |

```typescript
export const WEATHER_CONSTANTS = { ... } as const;
```

## uvDescriptions

`uvDescriptions`: Objeto que mapea los índices UV a sus descripciones correspondientes en español. Estos índices son utilizados para determinar el riesgo de exposición a la radiación ultravioleta.

| Nivel    | Descripción                                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| UNKNOWN  | No se puede determinar el riesgo de exposición.                                                                                                 |
| LOW      | Puedes disfrutar de estar afuera con seguridad.                                                                                                 |
| MODERATE | Busca sombra durante las horas del mediodía. Ponte una remera, utiliza protector solar y un sombrero.                                           |
| HIGH     | Evita estar afuera durante las horas del mediodía. Asegúrate de buscar sombra. La remera, el protector solar y el sombrero son imprescindibles. |

```typescript
export const uvDescriptions = {
  UNKNOWN: "No se puede determinar el riesgo de exposición.",
  LOW: "Puedes disfrutar de estar afuera con seguridad.",
  MODERATE:
    "Busca sombra durante las horas del mediodía. Ponte una remera, utiliza protector solar y un sombrero.",
  HIGH: "Evita estar afuera durante las horas del mediodía. Asegúrate de buscar sombra. La remera, el protector solar y el sombrero son imprescindibles.",
} as const;
```

## WMOWeatherTexts

`WMOWeatherTexts`: Objeto que mapea los códigos de tiempo WMO a sus descripciones correspondientes en español. Estos códigos son utilizados para interpretar las condiciones meteorológicas de manera estandarizada.

| Código | Descripción                                  | Traducción                 |
| ------ | -------------------------------------------- | -------------------------- |
| 0      | `WeatherDescriptions.clear_sky`              | Cielo despejado            |
| 1      | `WeatherDescriptions.mainly_clear`           | Mayormente despejado       |
| 2      | `WeatherDescriptions.partly_cloudy`          | Parcialmente nublado       |
| 3      | `WeatherDescriptions.overcast`               | Nublado                    |
| 45     | `WeatherDescriptions.fog`                    | Niebla                     |
| 48     | `WeatherDescriptions.depositing_rime_fog`    | Niebla con escarcha        |
| 51     | `WeatherDescriptions.drizzle_light`          | Llovizna ligera            |
| 53     | `WeatherDescriptions.drizzle_moderate`       | Llovizna moderada          |
| 55     | `WeatherDescriptions.drizzle_dense`          | Llovizna densa             |
| 56     | `WeatherDescriptions.freezing_drizzle_light` | Llovizna helada ligera     |
| 57     | `WeatherDescriptions.freezing_drizzle_dense` | Llovizna helada densa      |
| 61     | `WeatherDescriptions.rain_slight`            | Lluvia ligera              |
| 63     | `WeatherDescriptions.rain_moderate`          | Lluvia moderada            |
| 65     | `WeatherDescriptions.rain_heavy`             | Lluvia intensa             |
| 66     | `WeatherDescriptions.freezing_rain_light`    | Lluvia helada ligera       |
| 67     | `WeatherDescriptions.freezing_rain_heavy`    | Lluvia helada intensa      |
| 71     | `WeatherDescriptions.snowfall_slight`        | Nevada ligera              |
| 73     | `WeatherDescriptions.snowfall_moderate`      | Nevada moderada            |
| 75     | `WeatherDescriptions.snowfall_heavy`         | Nevada intensa             |
| 77     | `WeatherDescriptions.snow_grains`            | Granos de nieve            |
| 80     | `WeatherDescriptions.rain_showers_slight`    | Chubascos ligeros          |
| 81     | `WeatherDescriptions.rain_showers_moderate`  | Chubascos moderados        |
| 82     | `WeatherDescriptions.rain_showers_violent`   | Chubascos violentos        |
| 85     | `WeatherDescriptions.snow_showers_slight`    | Chubascos de nieve ligera  |
| 86     | `WeatherDescriptions.snow_showers_heavy`     | Chubascos de nieve intensa |
| 95     | `WeatherDescriptions.thunderstorm`           | Tormenta                   |

```typescript
export const WMOWeatherTexts: Record<number, WeatherDescriptions> = { ... } as const;
```

> Nota: Para conocer con mas detalle las descripciones del tipos `WeatherDescriptions` puedes consultar la [documentación](./types.md#weatherdescriptions).

## UNITS

`UNITS`: Objeto que mapea las claves de los parámetros meteorológicos a sus unidades correspondientes.

| Clave                     | Descripción |
| ------------------------- | ----------- |
| time                      | iso8601     |
| temperature_2m_max        | ºC          |
| temperature_2m_min        | ºC          |
| sunrise                   | iso8601     |
| sunset                    | iso8601     |
| daylight_duration         | h           |
| hour                      | iso8601     |
| temperature_2m            | ºC          |
| relative_humidity_2m      | %           |
| dew_point_2m              | ºC          |
| apparent_temperature      | ºC          |
| precipitation_probability | %           |
| precipitation             | mm          |
| rain                      | mm          |
| snowfall                  | cm          |
| snow_depth                | m           |
| weather_code              | wmo code    |
| pressure_msl              | hPa         |
| cloud_cover               | %           |
| visibility                | km          |
| wind_direction_10m        | º           |
| wind_speed_10m            | km/h        |
| uv_index                  | ...         |
| is_day                    | ...         |

```typescript
export const UNITS = { ... } as const;
```
