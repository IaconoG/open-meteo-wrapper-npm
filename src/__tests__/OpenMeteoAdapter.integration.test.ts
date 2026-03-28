import { WeatherData } from "@/types/apiTypes";
import { OpenMeteoAdapter } from "../services/adapters/OpenMeteoAdapter";
import fullHourlyResponse from "../__tests-utils__/fullHourlyResponse";

describe("OpenMeteoAdapter - integración mínima", () => {
  it("crea 24 horas para el día", () => {
    const adapter = new OpenMeteoAdapter();
    const result = adapter.adapt(fullHourlyResponse as WeatherData, 0, 0);

    expect(result.currentDay.hourly).toHaveLength(24);
    expect(result.currentDay.hourly?.[0].temperature?.value).toBe(0);
    expect(result.currentDay.hourly?.[23].temperature?.value).toBe(23);
  });
});
