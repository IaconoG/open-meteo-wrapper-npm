# Open Meteo Wrapper

## Tabla de Contenidos

- [Descripción](#descripción)
- [Instalación](#instalación)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Documentación](#documentación)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción

Este paquete de npm permite obtener datos meteorológicos de la API [Open-Meteo](https://open-meteo.com) de forma sencilla.
El paquete exporta:

- Un **hook `useWeather`** que utiliza un almacenamiento global con Zustand.
- Un **servicio `fetchWeather`** que permite obtener datos meteorológicos directamente desde la API Open-Meteo.

El usuario puede optar por utilizar el hook `useWeather` o el servicio `fetchWeather` según sus necesidades.

## Instalación

```bash
npm install @giann/open-meteo-wrapper
```

## Tecnologías Utilizadas

El paquete está desarrollado con las siguientes tecnologías:

- [Open-Meteo](https://open-meteo.com) - Fuente de datos meteorológicos
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático y desarrollo
- [Zustand](https://zustand.surge.sh/) - Almacenamiento global de estado
- [Vite](https://vitejs.dev/) - Entorno de desarrollo rápido
- [Jest](https://jestjs.io/) - Pruebas unitarias

## Documentación

Para obtener más detalles sobre el uso del paquete, consulta la documentación:

- **[Guía de Uso](./docs/usage.md)**: Cómo utilizar `useWeather` y `fetchWeather`.
- **Referencia de la API**: Explicación detallada de los hooks, funciones y servicios disponibles.

  - [useWeather](./docs/api-reference/useWeather.md)
  - [useWeatherStore](./docs/api-reference/useWeatherStore.md)
  - [fetchWeatherService](./docs/api-reference/fetchWeatherService.md)

- **[Tipos Exportados](./docs/types.md)**: Definición de los tipos de datos utilizados en el paquete.

## Contribución

Si deseas contribuir al proyecto, por favor abre un issue o un pull request en el repositorio de GitHub.

## Licencia

MIT
