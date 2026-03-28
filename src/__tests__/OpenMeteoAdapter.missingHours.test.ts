import { WeatherData } from "@/types/apiTypes";
import { OpenMeteoAdapter } from "../services/adapters/OpenMeteoAdapter";

const partialHourly = {
  latitude: 1,
  longitude: 2,
  timezone: "UTC",
  hourly: {
    time: ["2026-02-01T01:00:00Z", "2026-02-01T05:00:00Z"],
    temperature_2m: [10, 15],
    weather_code: [0, 0],
  },
  daily: {
    time: ["2026-02-01T00:00:00Z"],
    temperature_2m_max: [20],
    temperature_2m_min: [5],
  },
} as WeatherData;

describe("OpenMeteoAdapter - horas faltantes", () => {
  it("completa horas faltantes con objetos hour", () => {
    const adapter = new OpenMeteoAdapter();
    const res = adapter.adapt(partialHourly as WeatherData, 0, 0);
    expect(res.currentDay.hourly).toHaveLength(24);
    // verificar que la hora 1 y 5 tengan temperatura, otras no
    expect(res.currentDay.hourly?.[1].temperature?.value).toBe(10);
    expect(res.currentDay.hourly?.[5].temperature?.value).toBe(15);
    expect(res.currentDay.hourly?.[0].temperature).toBeUndefined();
  });
});
