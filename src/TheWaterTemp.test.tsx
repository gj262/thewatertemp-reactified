import React from "react";
import { render } from "@testing-library/react";

import { TheWaterTemp, TheWaterTempProps } from "./TheWaterTemp";
import { ComponentTypes } from "./components";
import { Temperature, TemperatureScale, Station } from "./types";

function commonAppTest(overrideProps: Partial<TheWaterTempProps>) {
  const mockActions = makeMockActions();
  const {
    mockComponents,
    ...callbackTriggers
  } = makeMockComponentsWithCallbackTriggers();
  const userPreferences = {
    temperatureScale: TemperatureScale.CELSIUS
  };

  const renderProps = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
      navigateToStation={jest.fn()}
      {...overrideProps}
    />
  );

  return {
    mockActions,
    mockComponents,
    ...callbackTriggers,
    ...renderProps,
    ...overrideProps
  };
}

function makeMockActions() {
  return {
    loadUserPreferences: jest.fn(),
    updateUserPreferences: jest.fn(),
    loadStations: jest.fn(),
    loadLatestTemperature: jest.fn()
  };
}

function makeMockComponentsWithCallbackTriggers() {
  let temperatureScaleChangeTrigger = (scale: TemperatureScale) => {};
  let stationChangeTrigger = (station: Station) => {};

  const mocks: ComponentTypes = {
    Header: ({ right }) => <div>HEADER{right}</div>,
    TemperatureScaleSelector: ({ scale, onChange }) => {
      temperatureScaleChangeTrigger = onChange;
      return <div>SCALE: {scale}</div>;
    },
    SelectStation: ({ loading, station, stations, onChange }) => {
      stationChangeTrigger = onChange;
      return (
        <div>
          SELECT STATION {loading && "LOADING"} {station && station.name}{" "}
          {stations && stations[0].name}
        </div>
      );
    },
    TemperatureValue: ({ temperature }) => (
      <div>VALUE: {temperature ? temperature.value.toFixed(1) : "--.-"}</div>
    )
  };

  return {
    getTemperatureScaleChangeTrigger: () => temperatureScaleChangeTrigger,
    getStationChangeTrigger: () => stationChangeTrigger,
    mockComponents: mocks
  };
}

test("loads users preferences", () => {
  const { mockActions } = commonAppTest({});

  expect(mockActions.loadUserPreferences).toBeCalledTimes(1);
});

test("loads stations", () => {
  const { mockActions } = commonAppTest({});

  expect(mockActions.loadStations).toBeCalledTimes(1);
});

test("displays a header", () => {
  const { getByText } = commonAppTest({});

  expect(getByText("HEADER")).not.toBeNull();
});

test("displays no header until the user preferences arrive", () => {
  const { queryByText } = commonAppTest({ userPreferences: null });

  expect(queryByText("HEADER")).toBeNull();
});

test("may display a loading error", () => {
  const { queryByText } = commonAppTest({
    loadingError: "Cannot load the stations: blah"
  });

  expect(queryByText("Cannot load the stations: blah")).not.toBeNull();
});

test("passes down the users temperature scale to display", () => {
  const { getByText } = commonAppTest({});

  expect(
    getByText(new RegExp("SCALE: " + TemperatureScale.CELSIUS))
  ).not.toBeNull();
});

test("may update users preferences", () => {
  const { mockActions, getTemperatureScaleChangeTrigger } = commonAppTest({});

  getTemperatureScaleChangeTrigger()(TemperatureScale.FAHRENHEIT);

  expect(mockActions.updateUserPreferences).toBeCalledTimes(1);
  expect(mockActions.updateUserPreferences.mock.calls[0][0]).toStrictEqual({
    temperatureScale: TemperatureScale.FAHRENHEIT
  });
});

test("displays a station selector", () => {
  const { getByText } = commonAppTest({});

  expect(getByText(/SELECT STATION/)).not.toBeNull();
});

test("passes loading", () => {
  const { getByText } = commonAppTest({ loadingStations: true });

  expect(getByText(/LOADING/)).not.toBeNull();
});

test("passes the current station", () => {
  const { getByText } = commonAppTest({
    station: { name: "Somewhere", id: "22" }
  });

  expect(getByText(/Somewhere/)).not.toBeNull();
});

test("passes the stations list", () => {
  const { getByText } = commonAppTest({
    stations: [{ name: "Elsewhere", id: "22" }]
  });

  expect(getByText(/Elsewhere/)).not.toBeNull();
});

test("may update the station", () => {
  const navigateToStation = jest.fn();
  const { getStationChangeTrigger } = commonAppTest({ navigateToStation });

  getStationChangeTrigger()({ name: "Elsewhere", id: "22" });

  expect(navigateToStation).toBeCalledTimes(1);
  expect(navigateToStation.mock.calls[0][0]).toStrictEqual({
    name: "Elsewhere",
    id: "22"
  });
});

test("should link to the station", () => {
  const { getByText } = commonAppTest({
    station: { name: "Somewhere", id: "22" }
  });

  expect(getByText(/Station: 22/)).not.toBeNull();
});

test("might be an invalid station", () => {
  const { getByText } = commonAppTest({
    invalidStationId: "22"
  });

  expect(getByText(/This is not a valid station ID: 22/)).not.toBeNull();
});

test("might be loading the station", () => {
  const { getByText } = commonAppTest({});

  expect(getByText(/Station: loading.../)).not.toBeNull();
});

test("displays the latest temperature value", () => {
  const { getByText } = commonAppTest({
    latestTemperature: new Temperature(12.3456, TemperatureScale.FAHRENHEIT)
  });

  expect(getByText(/12.3/)).not.toBeNull();
});
