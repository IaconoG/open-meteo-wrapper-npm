# Guía de Tipos para la API de Clima

Este documento describe los tipos utilizados en la API de clima, proporcionando estructura y contexto para cada uno de
ellos.

## Fetch Weather types

### FetchWeatherProps

`FetchWeatherProps`: Objeto que contiene la latitud, longitud y los parámetros necesarios para obtener los datos
meteorológicos. que contienen los parámetros necesarios para obtener los datos meteorológicos por hora. Por defecto es
temperatura y código de tiempo meteorológico. |

<!-- prettier-ignore-start -->
| Propiedad      | Tipo               | Opcional | Descripción                                       |
| -------------- | ------------------ | -------- |  ------------------------------------------------ |
| `latitude`     | number             | No       | Latitud de la ubicación de la que se desean obtener los datos 
meteorológicos.   |
| `longitude`    | number             | No       | Longitud de la ubicación de la que se desean obtener los datos meteorológicos.  |
| `hourly`       | HourlyParams[]     | Sí       | Arreglo de objetos [(`HourlyParams`)](#hourlyparams), contienen los parámetros para obtener los datos meteorológicos por hora. <br> - Por defecto es temperatura y código de tiempo meteorológico.                     |
| `daily`        | DailyParams[]      | Sí       | Arreglo de objetos [(`DailyParams`)](#dailyparams), contienen los parámetros para obtener los datos meteorológicos diarios. <br> - Por defecto es temperatura máxima y mínima.                             |
| `timezone`     | string             | Sí       | Zona horaria de la ubicación. Por defecto es "America/Sao_Paulo".               |
| `pastDays`     | number             | Sí       | Número de días pasados para los que se desean obtener los datos meteorológicos. <br> - Por defecto es 1. |
| `forecastDays` | number             | Sí       | Número de días para los que se desean obtener el pronóstico meteorológico. <br> - Por defecto es 7. |
<!-- prettier-ignore-end -->

> Nota: Ejemplo de `FetchWeatherProps` en la sección de [Ejemplo de `FetchWeatherProps`](#ejemplo-de-fetchweatherprops).

#### DailyParams

`DailyParams`: Enum que contiene los parámetros necesarios para obtener los datos meteorológicos diarios.

- Por defectos los parámetros son `TemperatureMax` y `TemperatureMin`.

| Propiedad          | Descripción                                               |
| ------------------ | --------------------------------------------------------- |
| `TemperatureMax`   | Indica si se desea obtener la temperatura máxima del día. |
| `TemperatureMin`   | Indica si se desea obtener la temperatura mínima del día. |
| `Sunrise`          | Indica si se desea obtener la hora de salida del sol.     |
| `Sunset`           | Indica si se desea obtener la hora de puesta del sol.     |
| `DaylightDuration` | Indica si se desea obtener la duración del día.           |

#### HourlyParams

`HourlyParams`: Enum que contiene los parámetros necesarios para obtener los datos meteorológicos por hora.

- Por defectos los parámetros son `Temperature` y `WeatherCode`.

| Propiedad                  | Descripción                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `Temperature`              | Indica si se desea obtener la temperatura.                          |
| `RelativeHumidity`         | Indica si se desea obtener la humedad relativa.                     |
| `DewPoint`                 | Indica si se desea obtener el punto de rocío.                       |
| `ApparentTemperature`      | Indica si se desea obtener la sensación térmica.                    |
| `PrecipitationProbability` | Indica si se desea obtener la probabilidad de precipitación.        |
| `Precipitation`            | Indica si se desea obtener la cantidad de precipitación.            |
| `Rain`                     | Indica si se desea obtener la cantidad de lluvia.                   |
| `Snowfall`                 | Indica si se desea obtener la cantidad de nieve.                    |
| `SnowDepth`                | Indica si se desea obtener la cantidad de nieve acumulada.          |
| `WeatherCode`              | Indica si se desea obtener el código de tiempo meteorológico.       |
| `PressureMsl`              | Indica si se desea obtener la presión atmosférica al nivel del mar. |
| `CloudCover`               | Indica si se desea obtener la cobertura de nubes.                   |
| `Visibility`               | Indica si se desea obtener la visibilidad.                          |
| `WindSpeed`                | Indica si se desea obtener la velocidad del viento.                 |
| `WindDirection`            | Indica si se desea obtener la dirección del viento.                 |
| `UvIndex`                  | Indica si se desea obtener el índice UV.                            |
| `IsDay`                    | Indica si se desea obtener si es de día o de noche.                 |

## Fetch Weather Response types

### StructureWeatherData

`StructureWeatherData`: Objeto que contiene los datos meteorológicos de la API Open-Meteo.

<!-- prettier-ignore-start -->
| Propiedad    | Tipo               | Opcional | Descripción                                                                               |
| ------------ | ------------------ | -------- | ----------------------------------------------------------------------------------------- |
| `latitude`   | number             | No       | Latitud de la ubicación.                                                                  |
| `longitude`  | number             | No       | Longitud de la ubicación.                                                                 |
| `timezone`   | string             | No       | Zona horaria de la ubicación.                                                             |
| `currentDay` | DailyWeatherData   | No       | Datos meteorológicos [`DailyWeatherData`](#dailyweatherdata) del día actual.              |
| `pastDay`    | DailyWeatherData[] | No       | Arreglos de datos meteorológicos [`DailyWeatherData`](#dailyweatherdata) de días pasados. |
| `forecast`   | DailyWeatherData[] | No       | Arreglos de datos meteorológicos [`DailyWeatherData`](#dailyweatherdata) del pronóstico.  |
<!-- prettier-ignore-end -->

> Nota: Ejemplo de `StructureWeatherData` en la sección de
> [Ejemplo de `StructureWeatherData`](#ejemplo-de-structureweatherdata).

#### DailyWeatherData

`DailyWeatherData`: Objeto que contiene los datos meteorológicos diarios.

| Propiedad          | Tipo                      | Opcional | Descripción                                                   |
| ------------------ | ------------------------- | -------- | ------------------------------------------------------------- |
| `day`              | Metric<Date, "iso8601">   | Sí       | Objeto que contiene la fecha del día.                         |
| `hourly`           | HourlyWeatherData[]       | Sí       | Arreglo de datos meteorológicos `HourlyWeatherData` por hora. |
| `temperatureMax`   | Metric<number, "ºC">      | Sí       | Objeto que contiene la temperatura máxima del día.            |
| `temperatureMin`   | Metric<number, "ºC">      | Sí       | Objeto que contiene la temperatura mínima del día.            |
| `sunrise`          | Metric<Date, "iso8601">   | Sí       | Objeto que contiene la hora de salida del sol.                |
| `sunset`           | Metric<Date, "iso8601">   | Sí       | Objeto que contiene la hora de puesta del sol.                |
| `daylightDuration` | Metric<number, "minutes"> | Sí       | Objeto que contiene la duración del día.                      |

##### HourlyWeatherData

`HourlyWeatherData`: Objeto que contiene los datos meteorológicos por hora.

<!-- prettier-ignore-start -->
| Propiedad                  | Tipo                                | Opcional | Descripción                                                   |
| -------------------------- | ----------------------------------- | -------- | ------------------------------------------------------------- |
| `hour`                     | Metric<Date, "iso8601">             | Sí       | Objeto que contiene la fecha y hora.                          |
| `temperature`              | Metric<number, "ºC">                | Sí       | Objeto que contiene la temperatura.                           |
| `weatherCode`              | Metric<number, "wmo code">          | Sí       | Objeto que contiene el código de tiempo meteorológico, según el código WMO.      |
| `weatherDescriptions`      | Metric<WeatherDescriptions, "text"> | Sí       | Objeto que contiene la descripción del tiempo meteorológico según el código WMO. |
| `relativeHumidity`         | Metric<number, "%">                 | Sí       | Objeto que contiene la humedad relativa.                      |
| `dewPoint`                 | Metric<number, "ºC">                | Sí       | Objeto que contiene el punto de rocío.                        |
| `apparentTemperature`      | Metric<number, "ºC">                | Sí       | Objeto que contiene la sensación térmica.                     |
| `precipitationProbability` | Metric<number, "%">                 | Sí       | Objeto que contiene la probabilidad de precipitación.         |
| `precipitation`            | Metric<number, "mm">                | Sí       | Objeto que contiene la cantidad de precipitación.             |
| `rain`                     | Metric<number, "mm">                | Sí       | Objeto que contiene la cantidad de lluvia.                    |
| `snowfall`                 | Metric<number, "cm">                | Sí       | Objeto que contiene la cantidad de nieve.                     |
| `snowDepth`                | Metric<number, "cm">                | Sí       | Objeto que contiene la cantidad de nieve acumulada.           |
| `pressureMsl`              | Metric<number, "hPa">               | Sí       | Objeto que contiene la presión atmosférica al nivel del mar.  |
| `cloudCover`               | Metric<number, "%">                 | Sí       | Objeto que contiene la cobertura de nubes.                    |
| `visibility`               | Metric<number, "km">                | Sí       | Objeto que contiene la visibilidad.                           |
| `wind`                     | WindDataMetric                      | Sí       | Objeto que contiene la velocidad y dirección del viento.      |
| `uv`                       | UVDataMetric                        | Sí       | Objeto que contiene el índice UV.                             |
| `isDay`                    | Metric<boolean, "">                 | Sí       | Objeto que contiene si es de día o de noche.                  |
<!-- prettier-ignore-end -->

#### WeatherDescriptions

`WeatherDescriptions`: Enum que contiene las descripciones del tiempo meteorológico según el código WMO. Relación entre
códigos WMO y su descripción meteorológica correspondiente. WMO Weather interpretation codes (WW)

```typescript
export enum WeatherDescriptions {
  clear_sky = "Cielo despejado",
  mainly_clear = "Mayormente despejado",
  partly_cloudy = "Parcialmente nublado",
  overcast = "Mayormente nublado",
  fog = "Niebla",
  depositing_rime_fog = "Niebla con escarcha",
  drizzle_light = "Llovizna ligera",
  drizzle_moderate = "Llovizna moderada",
  drizzle_dense = "Llovizna densa",
  freezing_drizzle_light = "Llovizna helada ligera",
  freezing_drizzle_dense = "Llovizna helada densa",
  rain_slight = "Lluvia ligera",
  rain_moderate = "Lluvia moderada",
  rain_heavy = "Lluvia intensa",
  freezing_rain_light = "Lluvia helada ligera",
  freezing_rain_heavy = "Lluvia helada intensa",
  snowfall_slight = "Nevada ligera",
  snowfall_moderate = "Nevada moderada",
  snowfall_heavy = "Nevada intensa",
  snow_grains = "Precipitación de granos de nieve",
  rain_showers_slight = "Chubascos  ligera",
  rain_showers_moderate = "Chubascos  moderada",
  rain_showers_violent = "Chubascos  Violentos",
  snow_showers_slight = "Chubascos de nieve ligera",
  snow_showers_heavy = "Chubascos de nieve intensa",
  thunderstorm = "Tormenta",
}
```

#### WindDataMetric

`WindDataMetric`: Objeto que contiene la velocidad y dirección del viento.

| Propiedad   | Tipo                      | Opcional | Descripción                                  |
| ----------- | ------------------------- | -------- | -------------------------------------------- |
| `speed`     | Metric<number, "km/h">    | No       | Objeto que contiene la velocidad del viento. |
| `direction` | Metric<string, "compass"> | No       | Objeto que contiene la dirección del viento. |

```typescript
export interface WindDataMetric {
  speed: NumericMetric<"km/h">;
  direction?: NumericMetric<"º">;
}
```

#### UVDataMetric

`UVDataMetric`: Objeto que contiene el índice UV.

| Propiedad     | Tipo         | Opcional | Descripción                                   |
| ------------- | ------------ | -------- | --------------------------------------------- |
| `value`       | number       | No       | Valor del índice UV.                          |
| `riskLevel`   | string       | No       | Nivel de riesgo asociado al índice UV.        |
| `description` | UvRiskLevels | No       | Descripción del riesgo asociado al índice UV. |
| `unit`        | string       | No       | Unidad del índice UV.                         |

##### UvRiskLevels

`UvRiskLevels`: Enum que contiene los niveles de riesgo asociados al índice UV.

```typescript
export enum UvRiskLevels {
  UNKNOWN = "Desconocido",
  LOW = "Bajo",
  MODERATE = "Moderado",
  HIGH = "Alto",
}
```

#### FetchError

`FetchError`: Estructura de un error de la API.

| Propiedad   | Tipo        | Opcional | Descripción                           |
| ----------- | ----------- | -------- | ------------------------------------- |
| `error`     | string      | No       | Descripción del error.                |
| `status`    | number      | Sí       | Código de estado HTTP del error.      |
| `type`      | MessageType | No       | Tipo de mensaje del error.            |
| `errorType` | ErrorType   | No       | Tipo de error.                        |
| `info`      | string      | Sí       | Información adicional sobre el error. |

## Ejemplos

### Ejemplo de `FetchWeatherProps`

```typescript
const exampleFetchWeatherProps: FetchWeatherProps = {
  latitude: 40.7128,
  longitude: -74.006,
  hourly: [
    HourlyParams.Temperature,
    HourlyParams.RelativeHumidity,
    HourlyParams.DewPoint,
    HourlyParams.ApparentTemperature,
    HourlyParams.PrecipitationProbability,
    HourlyParams.Precipitation,
    HourlyParams.Rain,
    HourlyParams.Snowfall,
    HourlyParams.SnowDepth,
    HourlyParams.WeatherCode,
    HourlyParams.PressureMsl,
    HourlyParams.CloudCover,
    HourlyParams.Visibility,
    HourlyParams.WindSpeed,
    HourlyParams.WindDirection,
    HourlyParams.UvIndex,
    HourlyParams.IsDay,
  ],
  daily: [
    DailyParams.TemperatureMax,
    DailyParams.TemperatureMin,
    DailyParams.Sunrise,
    DailyParams.Sunset,
    DailyParams.DaylightDuration,
  ],
  timezone: "America/New_York",
  pastDays: 2,
  forecastDays: 7,
};
```

### Ejemplo de `StructureWeatherData`

```typescript
const exampleWeatherData: StructureWeatherData = {
  latitude: 40.7128,
  longitude: -74.006,
  timezone: "America/New_York",
  currentDay: {
    day: {
      value: new Date(),
      unit: "iso8601",
    },
    temperatureMax: {
      value: 15,
      unit: "ºC",
    },
    temperatureMin: {
      value: 10,
      unit: "ºC",
    },
    hourly: [
      {
        hour: {
          value: new Date(),
          unit: "iso8601",
        },
        temperature: {
          value: 15,
          unit: "ºC",
        },
        weatherCode: {
          value: 100,
          unit: "wmo code",
        },
      },
    ],
  },
  pastDay: [
    {
      day: {
        value: new Date(),
        unit: "iso8601",
      },
      temperatureMax: {
        value: 14,
        unit: "ºC",
      },
      temperatureMin: {
        value: 8,
        unit: "ºC",
      },
      hourly: [
        {
          hour: {
            value: new Date(),
            unit: "iso8601",
          },
          temperature: {
            value: 14,
            unit: "ºC",
          },
          weatherCode: {
            value: 101,
            unit: "wmo code",
          },
          uv: {
            value: 5,
            riskLevel: "Moderado",
            description:
              "Riesgo moderado de daño por exposición al sol sin protección.",
            unit: "text",
          },
          weatherDescriptions: {
            value: "Cielo despejado",
            unit: "text",
          },
          wind: {
            speed: {
              value: 8,
              unit: "km/h",
            },
            direction: {
              value: "N",
              unit: "compass",
            },
          },
        },
      ],
    },
  ],
  forecast: [
    {
      day: {
        value: new Date(),
        unit: "iso8601",
      },
      temperatureMax: {
        value: 16,
        unit: "ºC",
      },
      temperatureMin: {
        value: 12,
        unit: "ºC",
      },
      hourly: [
        {
          hour: {
            value: new Date(),
            unit: "iso8601",
          },
          temperature: {
            value: 16,
            unit: "ºC",
          },
          weatherCode: {
            value: 102,
            unit: "wmo code",
          },
          uvIndex: {
            value: 6,
            unit: "index",
          },
          weatherDescriptions: {
            value: "Cielo despejado",
            unit: "text",
          },
          wind: {
            speed: {
              value: 12,
              unit: "km/h",
            },
            direction: {
              value: "NE",
              unit: "compass",
            },
          },
        },
      ],
    },
  ],
};
```
