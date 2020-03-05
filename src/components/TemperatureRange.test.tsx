import React from "react";
import { render } from "@testing-library/react";
import { Temperature, TemperatureScale, TemperatureRange } from "../types";

import TemperatureRangeComponent from "./TemperatureRange";

const range: TemperatureRange = {
  min: new Temperature(51.456, TemperatureScale.FAHRENHEIT),
  avg: new Temperature(51.89, TemperatureScale.FAHRENHEIT),
  max: new Temperature(53.478, TemperatureScale.FAHRENHEIT)
};

test("renders each to 1 significant place", () => {
  const { getByText } = render(<TemperatureRangeComponent range={range} />);
  expect(getByText("51.5°")).not.toBeNull();
  expect(getByText("51.9°")).not.toBeNull();
  expect(getByText("53.5°")).not.toBeNull();
});

test("renders captions", () => {
  const { getByText } = render(<TemperatureRangeComponent range={range} />);
  expect(getByText("Min")).not.toBeNull();
  expect(getByText("Avg")).not.toBeNull();
  expect(getByText("Max")).not.toBeNull();
});

test("renders loading", () => {
  const { queryAllByText } = render(<TemperatureRangeComponent isLoading />);
  expect(queryAllByText(/loading/i)).toHaveLength(3);
});
