# Open Meteo Wrapper

Tabla de Contenidos

- [Open Meteo Wrapper](#open-meteo-wrapper)
  - [Descripción](#descripción)
  - [Instalación](#instalación)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Documentación](#documentación)
  - [Ejemplo de Uso](#ejemplo-de-uso)
    - [Uso del hook `useWeather`](#uso-del-hook-useweather)
    - [Uso del servicio `fetchWeather`](#uso-del-servicio-fetchweather)
  - [Contribución](#contribución)
  - [Licencia](#licencia)

## Descripción

Este paquete de npm permite obtener datos meteorológicos de la API [Open-Meteo](https://open-meteo.com) de forma sencilla. El paquete exporta un hook `useWeather` que utiliza un almacenamiento global con Zustand y un servicio `fetchWeather` que nos permite obtener datos meteorológicos de la API Open-Meteo. El usuario puede optar por utilizar el hook `useWeather` o el servicio `fetchWeather`.

## Instalación

```bash
npm install @giann/open-meteo-wrapper
```

## Tecnologías Utilizadas

El paquete está desarrollado con las siguientes tecnologías:

- [Open-Meteo](https://open-meteo.com) - Utilizada para obtener datos meteorológicos
- [TypeScript](https://www.typescriptlang.org/) - Utilizado para el desarrollo del paquete
- [Zustand](https://zustand.surge.sh/) - Utilizado para el almacenamiento global
- [Vite](https://vitejs.dev/) - Utilizado para el desarrollo del paquete
- [Jest](https://jestjs.io/) - Utilizado para las pruebas unitarias

## Documentación

Para obtener más detalles sobre el uso del paquete, consulta la documentación:

- [Guía de Uso](./docs/usage.md): Cómo utilizar `useWeather` y `fetchWeather`.
- Referencia de la API: Explicación detallada de los hooks, funciones y servicios disponibles.

  - [useWeather](./docs/api-reference/useWeather.md)
  - [useWeatherStore](./docs/api-reference/useWeatherStore.md)
  - [fetchWeatherService](./docs/api-reference/fetchWeatherService.md)

- [Tipos Exportados](./docs/types.md): Definición de los tipos de datos utilizados en el paquete.
- [Constantes](./docs/constants.md): Constantes utilizadas en el paquete.

## Ejemplo de Uso

A continuación, ejemplos básicos de cómo usar el hook `useWeather` y el servicio `fetchWeather`:

### Uso del hook `useWeather`

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

### Uso del servicio `fetchWeather`

```typescript
import { fetchWeather } from "@giann/open-meteo-wrapper";

async function getWeather() {
  const weatherData = await fetchWeather({
    latitude: 40.7128,
    longitude: -74.006,
  });
  console.log(weatherData);
}

getWeather();
```

Para más ejemplos y casos de uso avanzados, consulta la [Guía de Uso](./docs/usage.md).

## Contribución

Si deseas contribuir al proyecto, por favor abre un issue o un pull request en el repositorio de GitHub [Open Meteo Wrapper NPM](https://github.com/IaconoG/open-meteo-wrapper-npm)

## Licencia

MIT
