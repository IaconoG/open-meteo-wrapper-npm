import { OpenMeteoAdapter } from "../services/adapters/OpenMeteoAdapter";
import { WeatherData } from "../types/apiTypes";
import { WeatherQueryMode } from "../types/weatherTypes";

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

  it("respeta el modo time interval sin inventar días pasados", () => {
    const raw: WeatherData = {
      latitude: 1,
      longitude: 2,
      timezone: "UTC",
      current: {
        time: new Date("2025-01-01T12:00:00Z").toISOString(),
        weather_code: 0,
        temperature_2m: 11,
      },
      hourly: {
        time: [],
        temperature_2m: [],
        weather_code: [],
      },
      daily: {
        time: ["2025-01-01T00:00:00Z", "2025-01-02T00:00:00Z"],
        temperature_2m_max: [12, 13],
        temperature_2m_min: [8, 9],
      },
    } as WeatherData;

    const adapter = new OpenMeteoAdapter();
    const result = adapter.adapt(raw, {
      latitude: 1,
      longitude: 2,
      mode: WeatherQueryMode.TimeInterval,
      start_date: "2025-01-01",
      end_date: "2025-01-02",
    });

    expect(result.pastDay).toHaveLength(0);
    expect(result.currentDay.day?.value.toISOString().slice(0, 10)).toBe(
      "2025-01-01",
    );
    expect(result.forecast).toHaveLength(1);
    expect(result.current?.temperature?.value).toBe(11);
  });
});
