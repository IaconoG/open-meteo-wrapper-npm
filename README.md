# Open Meteo Wrapper

Tabla de Contenidos

- [Open Meteo Wrapper](#open-meteo-wrapper)
  - [Descripción](#descripción)
  - [Instalación](#instalación)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Documentación](#documentación)
  - [Ejemplo de Uso](#ejemplo-de-uso)
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

```typescript
import { useWeather, fetchWeatherService } from "@giann/open-meteo-wrapper";

// Usando el hook useWeather
const WeatherComponent = () => {
  const { weather, fetchWeather } = useWeather();
  const location = { lat: 40.7128, lon: -74.006 };

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, []);

  return (
    <div>
      <h1>Weather in New York</h1>
      <pre>{JSON.stringify(weather, null, 2)}</pre>
    </div>
  );
};

// Usando el servicio fetchWeatherService
const getWeather = async () => {
  const weatherData = await fetchWeatherService(location.lat, location.lon);
  console.log(weatherData);
};

getWeather();
```

## Contribución

Si deseas contribuir al proyecto, por favor abre un issue o un pull request en el repositorio de GitHub (https://github.com/IaconoG/open-meteo-wrapper-npm)

## Licencia

MIT
