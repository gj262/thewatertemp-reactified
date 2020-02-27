import React from "react";
import { render } from "@testing-library/react";
import { TheWaterTemp, Components } from "./TheWaterTemp";
import { TemperatureScale } from "./types";

const mockActions = {
  loadUserPreferences: jest.fn(),
  updateUserPreferences: jest.fn()
};

const mockComponents: Components = {
  Header: ({ right }) => <div>HEADER{right}</div>,
  TemperatureScaleSelector: ({ scale }) => <div>SCALE: {scale}</div>
};

function makeMockComponentsAndTriggers() {
  let myTemperatureScaleChangeTrigger = (scale: TemperatureScale) => {};
  const mockComponents: Components = {
    Header: ({ right }) => <div>HEADER{right}</div>,
    TemperatureScaleSelector: ({ scale, onChange }) => {
      myTemperatureScaleChangeTrigger = onChange;
      return <div>SCALE: {scale}</div>;
    }
  };
  return {
    getTemperatureScaleChangeTrigger: () => myTemperatureScaleChangeTrigger,
    mockComponents
  };
}

const userPreferences = {
  temperatureScale: TemperatureScale.CELSIUS
};

test("loads a users preferences", () => {
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

test("gives it the input temperature scale", () => {
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

test("updates users preferences", () => {
  const {
    getTemperatureScaleChangeTrigger,
    mockComponents
  } = makeMockComponentsAndTriggers();
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
