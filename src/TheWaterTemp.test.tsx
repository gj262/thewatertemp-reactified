import React from "react";
import { render } from "@testing-library/react";
import { TheWaterTemp } from "./TheWaterTemp";
import { ComponentTypes } from "./components";
import { TemperatureScale } from "./types";

const mockActions = {
  loadUserPreferences: jest.fn(),
  updateUserPreferences: jest.fn()
};

const mockComponents: ComponentTypes = {
  Header: ({ right }) => <div>HEADER{right}</div>,
  TemperatureScaleSelector: ({ scale }) => <div>SCALE: {scale}</div>
};

function makeMockComponentsWithTriggers() {
  let temperatureScaleChangeTrigger = (scale: TemperatureScale) => {};
  const mockComponents: ComponentTypes = {
    Header: ({ right }) => <div>HEADER{right}</div>,
    TemperatureScaleSelector: ({ scale, onChange }) => {
      temperatureScaleChangeTrigger = onChange;
      return <div>SCALE: {scale}</div>;
    }
  };
  return {
    getTemperatureScaleChangeTrigger: () => temperatureScaleChangeTrigger,
    mockComponents
  };
}

const userPreferences = {
  temperatureScale: TemperatureScale.CELSIUS
};

test("loads users preferences", () => {
  render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
    />
  );
  expect(mockActions.loadUserPreferences).toBeCalledTimes(1);
});

test("displays a header", () => {
  const { getByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
    />
  );
  expect(getByText("HEADER")).not.toBeNull();
});

test("displays no header until the user preferences arrive", () => {
  const { queryByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={null}
    />
  );
  expect(queryByText("HEADER")).toBeNull();
});

test("passes down the users temperature scale to display", () => {
  const { getByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
    />
  );
  expect(
    getByText(new RegExp("SCALE: " + TemperatureScale.CELSIUS))
  ).not.toBeNull();
});

test("may update users preferences", () => {
  const {
    getTemperatureScaleChangeTrigger,
    mockComponents
  } = makeMockComponentsWithTriggers();
  render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
    />
  );
  getTemperatureScaleChangeTrigger()(TemperatureScale.FAHRENHEIT);
  expect(mockActions.updateUserPreferences).toBeCalledTimes(1);
  expect(mockActions.updateUserPreferences.mock.calls[0][0]).toStrictEqual({
    temperatureScale: TemperatureScale.FAHRENHEIT
  });
});
