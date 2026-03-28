import { WeatherData } from "@/types/apiTypes";
import { OpenMeteoAdapter } from "../services/adapters/OpenMeteoAdapter";

// Simular datos con timezone distinta (hora local vs UTC)
const tzRaw = {
  latitude: 1,
  longitude: 2,
  timezone: "America/Sao_Paulo",
  hourly: {
    time: ["2026-02-01T00:00:00-03:00", "2026-02-01T01:00:00-03:00"],
    temperature_2m: [12, 13],
    weather_code: [0, 0],
  },
  daily: {
    time: ["2026-02-01"],
    temperature_2m_max: [14],
    temperature_2m_min: [10],
  },
} as WeatherData;

describe("OpenMeteoAdapter - timezone handling", () => {
  it("produce horas consistentes independientemente del timezone string", () => {
    const adapter = new OpenMeteoAdapter();
    const res = adapter.adapt(tzRaw as WeatherData, 0, 0);
    expect(res.currentDay.hourly).toHaveLength(24);
    // comprobar que las horas se asignan, al menos las dos primeras
    expect(res.currentDay.hourly?.[0].temperature?.value).toBe(12);
    expect(res.currentDay.hourly?.[1].temperature?.value).toBe(13);
  });
});
