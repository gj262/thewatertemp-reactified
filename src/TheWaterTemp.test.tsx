import React from "react";
import { render } from "@testing-library/react";

import { TheWaterTemp } from "./TheWaterTemp";
import { ComponentTypes } from "./components";
import { TemperatureScale, Station } from "./types";

export const mockActions = {
  loadUserPreferences: jest.fn(),
  updateUserPreferences: jest.fn(),
  updateSelectedStation: jest.fn()
};

export const mockComponents: ComponentTypes = {
  Header: ({ right }) => <div>HEADER{right}</div>,
  TemperatureScaleSelector: ({ scale }) => <div>SCALE: {scale}</div>,
  SelectStation: ({ loading, station, stations }) => (
    <div>
      SELECT STATION {loading && "LOADING"} {station && station.name}{" "}
      {stations && stations[0].name}
    </div>
  )
};

function makeMockComponentsWithTriggers() {
  let temperatureScaleChangeTrigger = (scale: TemperatureScale) => {};
  let stationChangeTrigger = (station: Station) => {};

  const mocks: ComponentTypes = {
    Header: mockComponents.Header,
    TemperatureScaleSelector: ({ scale, onChange }) => {
      temperatureScaleChangeTrigger = onChange;
      return <div>SCALE: {scale}</div>;
    },
    SelectStation: ({ onChange }) => {
      stationChangeTrigger = onChange;
      return <div>SELECT STATION</div>;
    }
  };

  return {
    getTemperatureScaleChangeTrigger: () => temperatureScaleChangeTrigger,
    getStationChangeTrigger: () => stationChangeTrigger,
    mockComponents: mocks
  };
}

export const userPreferences = {
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

test("may display a loading error", () => {
  const { queryByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
      loadingError="Cannot load the stations: blah"
    />
  );
  expect(queryByText("Cannot load the stations: blah")).not.toBeNull();
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

test("displays a station selector", () => {
  const { getByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
    />
  );
  expect(getByText(/SELECT STATION/)).not.toBeNull();
});

test("passes loading", () => {
  const { getByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
      loadingStations
    />
  );
  expect(getByText(/LOADING/)).not.toBeNull();
});

test("passes the current station", () => {
  const { getByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
      station={{ name: "Somewhere", id: "22" }}
    />
  );
  expect(getByText(/Somewhere/)).not.toBeNull();
});

test("passes the stations list", () => {
  const { getByText } = render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
      stations={[{ name: "Elsewhere", id: "22" }]}
    />
  );
  expect(getByText(/Elsewhere/)).not.toBeNull();
});

test("may update the station", () => {
  const {
    getStationChangeTrigger,
    mockComponents
  } = makeMockComponentsWithTriggers();
  render(
    <TheWaterTemp
      actions={mockActions}
      Components={mockComponents}
      userPreferences={userPreferences}
    />
  );
  getStationChangeTrigger()({ name: "Elsewhere", id: "22" });
  expect(mockActions.updateSelectedStation).toBeCalledTimes(1);
  expect(mockActions.updateSelectedStation.mock.calls[0][0]).toStrictEqual({
    name: "Elsewhere",
    id: "22"
  });
});
