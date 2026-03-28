import { WeatherData } from "../types/apiTypes";

const day = "2026-02-01";

const hourlyTimes = Array.from({ length: 24 }).map(
  (_, h) => `${day}T${String(h).padStart(2, "0")}:00:00Z`,
);
const hourlyTemps = Array.from({ length: 24 }).map((_, h) => h);
const weatherCodes = Array.from({ length: 24 }).map(() => 0);

export const fullHourlyResponse: WeatherData = {
  latitude: 10,
  longitude: 20,
  timezone: "UTC",
  hourly: {
    time: hourlyTimes,
    temperature_2m: hourlyTemps,
    weather_code: weatherCodes,
  },
  daily: {
    time: [`${day}T00:00:00Z`],
    temperature_2m_max: [23],
    temperature_2m_min: [0],
  },
} as WeatherData;

export default fullHourlyResponse;
