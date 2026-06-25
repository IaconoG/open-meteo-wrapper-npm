import { FetchError } from "@/types/weatherTypes";
import { OpenMeteoClient } from "../services/api/OpenMeteoClient";
import { WeatherData } from "../types/apiTypes";
import { CurrentParams, WeatherQueryMode } from "../types/weatherTypes";

// Mock global fetch
const originalFetch = global.fetch;

describe("OpenMeteoClient", () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("devuelve datos cuando fetch ok", async () => {
    const fakeResponse = {
      json: async () => ({
        latitude: 1,
        longitude: 2,
        timezone: "UTC",
        hourly: { time: [], temperature_2m: [], weather_code: [] },
        daily: { time: [], temperature_2m_max: [], temperature_2m_min: [] },
      }),
    } as Response;
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => fakeResponse.json() });

    const client = new OpenMeteoClient();
    const result = await client.fetchRaw({
      latitude: 1,
      longitude: 2,
      hourly: [],
      daily: [],
      timezone: "UTC",
      past_days: 0,
      forecast_days: 0,
    });

    expect((result as WeatherData).latitude).toBe(1);
  });

  it("devuelve FetchError cuando fetch ok es false", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    const client = new OpenMeteoClient();
    const result = await client.fetchRaw({
      latitude: 1,
      longitude: 2,
      hourly: [],
      daily: [],
      timezone: "UTC",
      past_days: 0,
      forecast_days: 0,
    });

    expect((result as FetchError).error).toBe(
      "Debido a un problema en el servidor, no podemos obtener la información del clima.",
    );
  });

  it("construye una consulta por intervalo de tiempo con current", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        latitude: 1,
        longitude: 2,
        timezone: "UTC",
        hourly: { time: [], temperature_2m: [], weather_code: [] },
        daily: { time: [], temperature_2m_max: [], temperature_2m_min: [] },
      }),
    });

    const client = new OpenMeteoClient();
    await client.fetchRaw({
      latitude: 1,
      longitude: 2,
      hourly: [],
      daily: [],
      current: [CurrentParams.WeatherCode, CurrentParams.Temperature],
      timezone: "UTC",
      mode: WeatherQueryMode.TimeInterval,
      start_date: "2025-01-01",
      end_date: "2025-01-02",
    });

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
    const url = new URL(fetchCall);

    expect(url.searchParams.get("current")).toBe("weather_code,temperature_2m");
    expect(url.searchParams.get("start_date")).toBe("2025-01-01");
    expect(url.searchParams.get("end_date")).toBe("2025-01-02");
    expect(url.searchParams.get("past_days")).toBeNull();
    expect(url.searchParams.get("forecast_days")).toBeNull();
  });
});
