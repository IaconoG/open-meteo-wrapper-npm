# Weather-NPM

Este paquete npm proporciona componentes React para mostrar información del clima en tres vistas diferentes:

- **Vista reducida:** Muestra un icono, temperatura y descripción del clima.
- **Vista básica:** Incluye la vista reducida más información sobre viento, humedad, sensación térmica, visibilidad e índice UV.
- **Vista completa:** Próximamente disponible.

## Instalación

```sh
npm install weather-npm
```

## Uso

Importa y utiliza los componentes en tu aplicación:

```tsx
import { WeatherMinimal, WeatherBasic } from "weather-npm";

function App() {
  return (
    <div>
      <WeatherMinimal location="Madrid, España" />
      <WeatherBasic location="Buenos Aires, Argentina" />
    </div>
  );
}
```

## Tecnologías utilizadas

El paquete está desarrollado con las siguientes tecnologías:

- **Vite**: Herramienta de desarrollo rápida para proyectos de React y TypeScript.
- **React**: Biblioteca para la construcción de interfaces de usuario.
- **TypeScript**: Aporta tipado estático a JavaScript, mejorando la seguridad del código.
- **Material-UI**: Proporciona componentes estilizados y personalizables para la interfaz.
- **Jest**: Framework de testing para verificar el correcto funcionamiento de la API y los componentes.

## Desarrollo

Para clonar y probar el paquete localmente:

```sh
git clone https://github.com/usuario/weather-npm.git
cd weather-npm
npm install
npm run dev
```

## Tests

Ejecuta las pruebas con:

```sh
npm run test
```

## Publicación

Para publicar el paquete en npm:

```sh
npm publish --access private
```

## Licencia

MIT
