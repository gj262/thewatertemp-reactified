import React from "react";
import { render } from "@testing-library/react";
import { Temperature, TemperatureScale } from "../types";

import TemperatureRange from "./TemperatureRange";

const min = new Temperature(51.456, TemperatureScale.FAHRENHEIT);
const avg = new Temperature(51.89, TemperatureScale.FAHRENHEIT);
const max = new Temperature(53.478, TemperatureScale.FAHRENHEIT);

test("renders each to 1 significant place", () => {
  const { getByText } = render(
    <TemperatureRange min={min} avg={avg} max={max} />
  );
  expect(getByText("51.5°")).not.toBeNull();
  expect(getByText("51.9°")).not.toBeNull();
  expect(getByText("53.5°")).not.toBeNull();
});

test("renders captions", () => {
  const { getByText } = render(
    <TemperatureRange min={min} avg={avg} max={max} />
  );
  expect(getByText("Min")).not.toBeNull();
  expect(getByText("Avg")).not.toBeNull();
  expect(getByText("Max")).not.toBeNull();
});
