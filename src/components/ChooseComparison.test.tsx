import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChooseComparison from "./ChooseComparison";
import { TemperatureDataIds } from "../types";

const comparisons = [
  { id: TemperatureDataIds.LAST_SEVEN_DAYS, label: "Last 7 days" },
  { id: TemperatureDataIds.TODAY_IN_PRIOR_YEARS, label: "Today in prior years" }
];

test("renders", () => {
  const { queryByDisplayValue } = render(
    <ChooseComparison selectedId={comparisons[1].id} comparisons={comparisons} onChange={() => null} />
  );
  expect(queryByDisplayValue(comparisons[0].label)).toBeNull();
  expect(queryByDisplayValue(comparisons[1].label)).not.toBeNull();
});

test("renders a different comparison when foisted", () => {
  const { queryByDisplayValue, rerender } = render(
    <ChooseComparison selectedId={comparisons[1].id} comparisons={comparisons} onChange={() => null} />
  );
  rerender(<ChooseComparison selectedId={comparisons[0].id} comparisons={comparisons} onChange={() => null} />);
  expect(queryByDisplayValue(comparisons[0].label)).not.toBeNull();
});

test("hits the change callback", () => {
  const onChange = jest.fn();

  const { getByDisplayValue } = render(
    <ChooseComparison selectedId={comparisons[1].id} comparisons={comparisons} onChange={onChange} />
  );
  userEvent.selectOptions(getByDisplayValue(comparisons[1].label), comparisons[0].id);

  expect(onChange.mock.calls[0][0]).toBe(comparisons[0].id);
});
