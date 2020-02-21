import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TemperatureScaleSelector from "./TemperatureScaleSelector";
import { TemperatureScale } from "../types";

test("renders °F", () => {
  const { getByDisplayValue } = render(
    <TemperatureScaleSelector
      scale={TemperatureScale.FAHRENHEIT}
      onChange={() => null}
    />
  );
  expect(getByDisplayValue(/°F/i)).toBeInTheDocument();
});

test("renders °C", () => {
  const { getByDisplayValue } = render(
    <TemperatureScaleSelector
      scale={TemperatureScale.CELSIUS}
      onChange={() => null}
    />
  );
  expect(getByDisplayValue(/°C/i)).toBeInTheDocument();
});

test("is controlled by prop scale change", () => {
  const { getByDisplayValue, rerender } = render(
    <TemperatureScaleSelector
      scale={TemperatureScale.CELSIUS}
      onChange={() => null}
    />
  );
  rerender(
    <TemperatureScaleSelector
      scale={TemperatureScale.FAHRENHEIT}
      onChange={() => null}
    />
  );
  expect(getByDisplayValue(/°F/i)).toBeInTheDocument();
});

test("reports change", () => {
  const onChange = jest.fn();
  const { getByDisplayValue } = render(
    <TemperatureScaleSelector
      scale={TemperatureScale.CELSIUS}
      onChange={onChange}
    />
  );
  const select = getByDisplayValue(/°C/i);
  userEvent.selectOptions(select, TemperatureScale.FAHRENHEIT);
  expect(onChange.mock.calls.length).toBe(1);
  expect(onChange.mock.calls[0][0]).toBe(TemperatureScale.FAHRENHEIT);
});
