import React from "react";
import { render } from "@testing-library/react";
import { Temperature, TemperatureScale } from "../types";

import TemperatureValue from "./TemperatureValue";

const t = new Temperature(12.3456, TemperatureScale.FAHRENHEIT);

test("renders", () => {
  render(<TemperatureValue temperature={t} />);
});

test("renders to 1 significant place", () => {
  const { getByText } = render(<TemperatureValue temperature={t} />);
  expect(getByText("12.3°")).not.toBeNull();
});

test("may show a caption", () => {
  const { getByText } = render(
    <TemperatureValue temperature={t} caption="Min" />
  );
  expect(getByText("Min")).not.toBeNull();
});

test("captions may be react elements", () => {
  const { getByText } = render(
    <TemperatureValue temperature={t} caption={<span>I'm a caption</span>} />
  );
  expect(getByText("I'm a caption")).not.toBeNull();
});

test("may show loading", () => {
  const { getByText } = render(<TemperatureValue isLoading caption="Min" />);
  expect(getByText(/loading/i)).not.toBeNull();
});

test("may show an error message", () => {
  const { getByText } = render(
    <TemperatureValue errorMsg="oops" caption="Min" />
  );
  expect(getByText(/oops/i)).not.toBeNull();
});

test("loading trumps errors", () => {
  const { queryByText } = render(
    <TemperatureValue isLoading errorMsg="oops" caption="Min" />
  );
  expect(queryByText(/oops/i)).toBeNull();
  expect(queryByText(/loading/i)).not.toBeNull();
});

test("may be large", () => {
  const { getByText } = render(<TemperatureValue temperature={t} large />);
  expect(getByText("12.3°")).toHaveClass("large");
});

test("missing temps show --.-", () => {
  const { getByText } = render(<TemperatureValue caption="Min" />);
  expect(getByText(/--.-/)).not.toBeNull();
});
