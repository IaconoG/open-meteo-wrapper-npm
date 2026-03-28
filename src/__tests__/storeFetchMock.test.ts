import { setWeatherFetcher, useWeatherStore } from "../store/useWeatherStore";

describe("Weather store with injected fetcher", () => {
  it("usa el fetcher inyectado", async () => {
    const mockFetcher = jest
      .fn()
      .mockResolvedValue({
        latitude: 1,
        longitude: 2,
        timezone: "UTC",
        pastDay: [],
        currentDay: {},
        forecast: [],
      });
    setWeatherFetcher(mockFetcher);

    const store = useWeatherStore.getState();
    await store.fetchWeather({ latitude: 1, longitude: 2 });

    expect(mockFetcher).toHaveBeenCalled();
  });
});
