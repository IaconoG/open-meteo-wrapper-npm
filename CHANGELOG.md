# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [1.0.1] - 2026-03-29

### Fixed

- Export enums (HourlyParams, DailyParams, MessageType, ErrorType) as runtime values, not type-only exports.
- This fixes runtime errors when trying to use enum values in fetchWeather calls.

## [1.0.0] - 2026-03-28

### Added

- Initial public release of @i-giann/open-meteo-wrapper.
- React hook API via useWeather.
- Zustand store integration via useWeatherStore.
- Weather service API via fetchWeather.
- TypeScript type exports for weather models.

### Packaging

- Publish-ready dist build output (ESM + CJS + type declarations).
- npm export map and Node engine constraints.
