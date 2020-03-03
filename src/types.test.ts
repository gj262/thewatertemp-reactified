import { Temperature, TemperatureScale } from "./types";

it("can convert temperature scales C -> F", () => {
  const was = new Temperature(10.0, TemperatureScale.CELSIUS);

  const now = was.usingScale(TemperatureScale.FAHRENHEIT);

  expect(was.value).toBe(10);
  expect(now.value).toBe(50);
});

it("can convert temperature scales F -> C", () => {
  const was = new Temperature(50.0, TemperatureScale.FAHRENHEIT);

  const now = was.usingScale(TemperatureScale.CELSIUS);

  expect(was.value).toBe(50);
  expect(now.value).toBe(10);
});

it("does not convert when there is no scale difference", () => {
  const was = new Temperature(50.0, TemperatureScale.FAHRENHEIT);

  const now = was.usingScale(TemperatureScale.FAHRENHEIT);

  expect(was).toBe(now);
});
