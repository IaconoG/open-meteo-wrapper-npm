// Deprecated test (copied for historical reference).
// Use the tests in the active test suite; do not use or update this file for new features.
// This file is excluded from test runs via jest.config.ts (testPathIgnorePatterns).

// Original: src/__tests__/weatherDataParser.test.ts

import { WeatherDataParser } from "../models/weatherDataParser";
import { WeatherData } from "../../src/types/apiTypes";
import { WeatherDescriptions } from "../../src/types/weatherTypes";

describe("WeatherDataParser", () => {
  const mockWeatherData: WeatherData = {
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
    hourly: {
      time: [
        new Date("2025-01-01T00:00:00Z"),
        new Date("2025-01-01T01:00:00Z"),
        new Date("2025-01-01T02:00:00Z"),
      ],
      temperature_2m: [20, 19, 18],
      weather_code: [0, 1, 2],
      relative_humidity_2m: [65, 70, 75],
      wind_speed_10m: [10, 12, 8],
      wind_direction_10m: [180, 190, 200],
      uv_index: [0, 0, 0],
      is_day: [0, 0, 0],
    },
    daily: {
      time: [new Date("2025-01-01")],
      temperature_2m_max: [25],
      temperature_2m_min: [15],
      sunrise: [new Date("2025-01-01T07:00:00Z")],
      sunset: [new Date("2025-01-01T18:00:00Z")],
      daylight_duration: [39600], // 11 horas en segundos
    },
  };

  describe("constructor and basic functionality", () => {
    it("should create parser instance with correct parameters", () => {
      const parser = new WeatherDataParser(mockWeatherData, 1, 7);
      expect(parser).toBeInstanceOf(WeatherDataParser);
    });

    it("should parse weather data with correct structure", () => {
      const parser = new WeatherDataParser(mockWeatherData, 0, 1);
      const result = parser.parse();

      expect(result).toHaveProperty("latitude", 40.7128);
      expect(result).toHaveProperty("longitude", -74.006);
      expect(result).toHaveProperty("timezone", "America/New_York");
      expect(result).toHaveProperty("pastDay");
      expect(result).toHaveProperty("currentDay");
      expect(result).toHaveProperty("forecast");
    });
  });

  describe("daily data processing", () => {
    it("should process daily data with simplified types", () => {
      const parser = new WeatherDataParser(mockWeatherData, 0, 1);
      const result = parser.parse();

      expect(result.currentDay).toHaveProperty("day");
      expect(result.currentDay).toHaveProperty("temperatureMax");
      expect(result.currentDay).toHaveProperty("temperatureMin");
      expect(result.currentDay).toHaveProperty("sunrise");
      expect(result.currentDay).toHaveProperty("sunset");
      expect(result.currentDay).toHaveProperty("daylightDuration");

      // Verificar estructura simplificada de tipos
      expect(result.currentDay.temperatureMax).toEqual({
        value: 25,
        unit: "ºC",
      });

      expect(result.currentDay.temperatureMin).toEqual({
        value: 15,
        unit: "ºC",
      });

      // Verificar conversión de duración de luz diurna (segundos a horas)
      expect(result.currentDay.daylightDuration).toEqual({
        value: 11, // 39600 / 3600
        unit: "h",
      });
    });

    it("should handle missing daily data gracefully", () => {
      const incompleteData: WeatherData = {
        ...mockWeatherData,
        daily: {
          time: [new Date("2025-01-01")],
          temperature_2m_max: [],
          temperature_2m_min: [],
        },
      };

      const parser = new WeatherDataParser(incompleteData, 0, 1);
      const result = parser.parse();

      expect(result.currentDay.temperatureMax).toBeUndefined();
      expect(result.currentDay.temperatureMin).toBeUndefined();
    });
  });

  describe("hourly data processing", () => {
    it("should process hourly data with simplified types", () => {
      const parser = new WeatherDataParser(mockWeatherData, 0, 1);
      const result = parser.parse();

      expect(result.currentDay.hourly).toBeDefined();
      expect(Array.isArray(result.currentDay.hourly)).toBe(true);

      const firstHour = result.currentDay.hourly![0];
      expect(firstHour).toHaveProperty("hour");
      expect(firstHour).toHaveProperty("temperature");
      expect(firstHour).toHaveProperty("weatherCode");
      expect(firstHour).toHaveProperty("relativeHumidity");

      // Verificar estructura simplificada
      expect(firstHour.temperature).toEqual({
        value: 20,
        unit: "ºC",
      });

      expect(firstHour.weatherCode).toEqual({
        value: 0,
        unit: "wmo code",
      });
    });

    it("should add weather descriptions based on WMO codes", () => {
      const parser = new WeatherDataParser(mockWeatherData, 0, 1);
      const result = parser.parse();

      const firstHour = result.currentDay.hourly![0];
      expect(firstHour.weatherDescription).toEqual({
        value: WeatherDescriptions.clear_sky,
        unit: "text",
      });
    });

    it("should process wind data correctly", () => {
      const parser = new WeatherDataParser(mockWeatherData, 0, 1);
      const result = parser.parse();

      const firstHour = result.currentDay.hourly![0];
      expect(firstHour.wind).toBeDefined();
      expect(firstHour.wind!.speed).toEqual({
        value: 10,
        unit: "km/h",
      });
      expect(firstHour.wind!.direction).toEqual({
        value: 180,
        unit: "º",
      });
    });

    it("should process UV data with risk assessment", () => {
      // Test con UV index más alto
      const dataWithUV: WeatherData = {
        ...mockWeatherData,
        hourly: {
          ...mockWeatherData.hourly,
          uv_index: [5, 8, 2], // Diferentes niveles de UV
        },
      };

      const parser = new WeatherDataParser(dataWithUV, 0, 1);
      const result = parser.parse();

      const firstHour = result.currentDay.hourly![0];
      expect(firstHour.uv).toBeDefined();
      expect(firstHour.uv!.value).toBe(5);
      expect(firstHour.uv!.riskLevel).toBeDefined();
      expect(firstHour.uv!.description).toBeDefined();
      expect(firstHour.uv!.unit).toBe("index");
    });

    it("should handle missing hourly data gracefully", () => {
      const incompleteHourlyData: WeatherData = {
        ...mockWeatherData,
        hourly: {
          time: [new Date("2025-01-01T00:00:00Z")],
          temperature_2m: [],
          weather_code: [],
        },
      };

      const parser = new WeatherDataParser(incompleteHourlyData, 0, 1);
      const result = parser.parse();

      const firstHour = result.currentDay.hourly![0];
      expect(firstHour.temperature).toBeUndefined();
      expect(firstHour.weatherCode).toBeUndefined();
    });

    it("should limit hourly data to 24 hours per day", () => {
      // Crear data con más de 24 horas
      const extendedTime = Array.from(
        { length: 48 },
        (_, i) =>
          new Date("2025-01-01T00:00:00Z").getTime() + i * 60 * 60 * 1000,
      ).map((time) => new Date(time));

      const extendedData: WeatherData = {
        ...mockWeatherData,
        hourly: {
          time: extendedTime,
          temperature_2m: Array(48).fill(20),
          weather_code: Array(48).fill(0),
        },
      };

      const parser = new WeatherDataParser(extendedData, 0, 1);
      const result = parser.parse();

      // Debe procesar solo las primeras 24 horas para el día actual
      expect(result.currentDay.hourly!.length).toBeLessThanOrEqual(24);
    });
  });

  describe("data organization", () => {
    it("should correctly organize past days, current day, and forecast", () => {
      const parser = new WeatherDataParser(mockWeatherData, 1, 2);
      const result = parser.parse();

      expect(Array.isArray(result.pastDay)).toBe(true);
      expect(result.currentDay).toBeDefined();
      expect(Array.isArray(result.forecast)).toBe(true);
    });

    it("should handle zero past days", () => {
      const parser = new WeatherDataParser(mockWeatherData, 0, 1);
      const result = parser.parse();

      expect(result.pastDay).toEqual([]);
      expect(result.currentDay).toBeDefined();
    });

    it("should handle zero forecast days", () => {
        const parser = new WeatherDataParser(mockWeatherData, 0, 0);
        const result = parser.parse();

        expect(result.currentDay).toBeDefined();
        expect(result.forecast).toEqual([]);
    });
  });
});
