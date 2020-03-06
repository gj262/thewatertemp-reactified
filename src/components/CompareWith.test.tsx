import React from "react";
import { render } from "@testing-library/react";
import { Temperature, TemperatureScale } from "../types";

import ComparedWith from "./CompareWith";

const list = [
  {
    regarding: "Tuesday",
    range: {
      min: new Temperature(51.456, TemperatureScale.FAHRENHEIT),
      avg: new Temperature(51.89, TemperatureScale.FAHRENHEIT),
      max: new Temperature(53.478, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Monday",
    range: {
      min: new Temperature(52, TemperatureScale.FAHRENHEIT),
      avg: new Temperature(53, TemperatureScale.FAHRENHEIT),
      max: new Temperature(54, TemperatureScale.FAHRENHEIT)
    }
  }
];

test("renders a list of ranges to compare against", () => {
  const { queryAllByText } = render(<ComparedWith list={list} />);

  expect(queryAllByText(/day/)).toHaveLength(2);
});

test("renders the list in order", () => {
  const { queryAllByText } = render(<ComparedWith list={list} />);

  const headerItems = queryAllByText(/day/);
  expect(headerItems[0]).toHaveTextContent(/tuesday/i);
  expect(headerItems[1]).toHaveTextContent(/monday/i);
});

test("renders all the range data", () => {
  const { queryAllByText } = render(<ComparedWith list={list} />);

  const temps = queryAllByText(/5.\../);
  expect(temps[0]).toHaveTextContent(/51.5/);
  expect(temps[1]).toHaveTextContent(/51.9/);
  expect(temps[2]).toHaveTextContent(/53.5/);
  expect(temps[3]).toHaveTextContent(/52.0/);
  expect(temps[4]).toHaveTextContent(/53.0/);
  expect(temps[5]).toHaveTextContent(/54.0/);
});

test("renders loading if the last item is not present", () => {
  const loadingList = [...list, { regarding: "Sunday" }];

  const { queryAllByText } = render(
    <ComparedWith isLoading list={loadingList} />
  );

  expect(queryAllByText(/loading/i)).toHaveLength(3);
});

test("wont show loading if the last item is present", () => {
  const { queryAllByText } = render(<ComparedWith isLoading list={list} />);

  expect(queryAllByText(/loading/i)).toHaveLength(0);
});
