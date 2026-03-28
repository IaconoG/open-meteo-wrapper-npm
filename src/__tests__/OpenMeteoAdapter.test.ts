import { OpenMeteoAdapter } from "../services/adapters/OpenMeteoAdapter";
import { WeatherData } from "../types/apiTypes";

describe("OpenMeteoAdapter", () => {
  it("adapta una respuesta mínima correctamente", () => {
    const raw: WeatherData = {
      latitude: 1,
      longitude: 2,
      timezone: "UTC",
      hourly: {
        time: [new Date().toISOString()],
        temperature_2m: [10],
        weather_code: [0],
      },
      daily: {
        time: [new Date().toISOString()],
        temperature_2m_max: [12],
        temperature_2m_min: [8],
      },
    } as WeatherData;

    const adapter = new OpenMeteoAdapter();
    const result = adapter.adapt(raw, 0, 0);

    expect(result.latitude).toBe(1);
    expect(result.longitude).toBe(2);
    expect(result.timezone).toBe("UTC");
    expect(result.currentDay).toBeDefined();
  });
});
