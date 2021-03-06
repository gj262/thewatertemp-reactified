import React from "react";
import { render } from "@testing-library/react";

import { Comparison, ComparisonProps, ComparisonComponentTypes } from "./Comparison";
import { TemperatureDataIds } from "../types";

const testStationId = "22";

const latestStationTime = new Date("2020-03-06 08:30"); // Friday

function commonTest(overrideProps: Partial<ComparisonProps>) {
  const mockActions = makeMockActions();
  const { mockComponents, ...callbackTriggers } = makeMockComponentsWithCallbackTriggers();

  const propsForRender = {
    actions: mockActions,
    dispatch: jest.fn(),
    Components: mockComponents,
    stationId: testStationId,
    latestStationTime,
    comparisonId: TemperatureDataIds.LAST_SEVEN_DAYS,
    onComparisonChange: jest.fn(),
    list: [],
    isLoading: false,
    endReason: null,
    ...overrideProps
  };

  const renderProps = render(<Comparison {...propsForRender} />);

  return {
    mockActions,
    mockComponents,
    ...callbackTriggers,
    ...renderProps,
    propsAtFirstRender: propsForRender
  };
}

function makeMockActions() {
  return {
    loadLastSevenDayComparison: jest.fn(),
    loadTodayInPriorYearsComparison: jest.fn((): { promise: Promise<void>; cancel: () => void } => {
      return {
        promise: new Promise(() => null),
        cancel: () => null
      };
    })
  };
}

function makeMockComponentsWithCallbackTriggers() {
  let comparisonChangeTrigger = (id: TemperatureDataIds) => {};

  const mocks: ComparisonComponentTypes = {
    ChooseComparison: ({ onChange }) => {
      comparisonChangeTrigger = onChange;
      return <div>CHOOSE</div>;
    },
    CompareWith: () => <div>COMPARED WITH</div>
  };

  return {
    getComparisonChangeTrigger: () => comparisonChangeTrigger,
    mockComponents: mocks
  };
}

test("loads comparison data", () => {
  const { mockActions } = commonTest({});

  expect(mockActions.loadLastSevenDayComparison).toBeCalledTimes(1);
  expect(mockActions.loadTodayInPriorYearsComparison).toBeCalledTimes(0);
});

test("loads the other comparison data", () => {
  const { mockActions } = commonTest({
    comparisonId: TemperatureDataIds.TODAY_IN_PRIOR_YEARS
  });

  expect(mockActions.loadLastSevenDayComparison).toBeCalledTimes(0);
  expect(mockActions.loadTodayInPriorYearsComparison).toBeCalledTimes(1);
});

test("loads comparison data when the station changes (foisted)", () => {
  const { mockActions, propsAtFirstRender, rerender } = commonTest({});

  rerender(<Comparison {...propsAtFirstRender} stationId="33" />);

  expect(mockActions.loadLastSevenDayComparison).toBeCalledTimes(2);
  expect(mockActions.loadLastSevenDayComparison.mock.calls[1][0]).toBe("33");
  expect(mockActions.loadTodayInPriorYearsComparison).toBeCalledTimes(0);
});

test("loads comparison data when the comparison changes (foisted)", () => {
  const { mockActions, propsAtFirstRender, rerender } = commonTest({});

  rerender(<Comparison {...propsAtFirstRender} comparisonId={TemperatureDataIds.TODAY_IN_PRIOR_YEARS} />);

  expect(mockActions.loadLastSevenDayComparison).toBeCalledTimes(1);
  expect(mockActions.loadTodayInPriorYearsComparison).toBeCalledTimes(1);
});

test("bubbles up the comparison change (for routing)", () => {
  const onChange = jest.fn();
  const { getComparisonChangeTrigger } = commonTest({
    onComparisonChange: onChange
  });

  getComparisonChangeTrigger()(TemperatureDataIds.TODAY_IN_PRIOR_YEARS);

  expect(onChange).toBeCalledTimes(1);
  expect(onChange.mock.calls[0][0]).toBe(TemperatureDataIds.TODAY_IN_PRIOR_YEARS);
});
