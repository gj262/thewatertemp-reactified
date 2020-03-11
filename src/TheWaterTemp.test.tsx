import React from "react";
import { render, wait } from "@testing-library/react";

import { TheWaterTemp, TheWaterTempProps, TheWaterTempComponentTypes, TheWaterTempContainerTypes } from "./TheWaterTemp";
import { Temperature, TemperatureScale, Station, TemperatureDataIds } from "./types";

const userPreferences = {
  temperatureScale: TemperatureScale.CELSIUS
};

function commonAppTest(overrideProps: Partial<TheWaterTempProps>) {
  const mockActions = makeMockActions();
  const { mockComponents, mockContainers, ...callbackTriggers } = makeMockComponentsWithCallbackTriggers();
  const userPreferences = {
    temperatureScale: TemperatureScale.CELSIUS
  };

  const renderProps = render(
    <TheWaterTemp
      actions={mockActions}
      dispatch={jest.fn()}
      Components={mockComponents}
      Containers={mockContainers}
      userPreferences={userPreferences}
      addRoutingState={jest.fn()}
      stationId="22"
      loadingStations={false}
      stations={null}
      errorLoadingStations={null}
      latestTemperature={null}
      errorLoadingLatestTemperature={null}
      last24Hours={null}
      comparisonId={TemperatureDataIds.LAST_SEVEN_DAYS}
      path=""
      {...overrideProps}
    />
  );

  return {
    mockActions,
    mockComponents,
    mockContainers,
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
    loadLatestTemperature: jest.fn(),
    loadLast24Hours: jest.fn()
  };
}

function makeMockComponentsWithCallbackTriggers() {
  let temperatureScaleChangeTrigger = (scale: TemperatureScale) => {};
  let stationChangeTrigger = (station: Station) => {};

  const mocks: TheWaterTempComponentTypes = {
    Header: ({ right }) => <div>HEADER{right}</div>,
    TemperatureScaleSelector: ({ scale, onChange }) => {
      temperatureScaleChangeTrigger = onChange;
      return <div>SCALE: {scale}</div>;
    },
    SelectStation: ({ loading, station, stations, onChange }) => {
      stationChangeTrigger = onChange;
      return (
        <div>
          SELECT STATION {loading && "LOADING"} {station && station.name} {stations && stations[0].name}
        </div>
      );
    },
    TemperatureValue: ({ temperature, caption }) => (
      <div>
        VALUE: {temperature ? temperature.value.toFixed(1) : "--.-"} {caption}
      </div>
    ),
    TemperatureRange: ({ range }) => (
      <>
        <div>Min: {range ? range.min.value : "--.-"} </div>
        <div>Avg: {range ? range.avg.value : "--.-"} </div>
        <div>Max: {range ? range.max.value : "--.-"} </div>
      </>
    ),
    Footer: () => <div>FOOTER</div>
  };

  let comparisonChangeTrigger = (comparisonId: TemperatureDataIds) => {};

  const containerMocks: TheWaterTempContainerTypes = {
    Comparison: ({ onComparisonChange, latestStationTime }) => {
      comparisonChangeTrigger = onComparisonChange;
      return <div>COMPARISON {latestStationTime.valueOf()}</div>;
    }
  };

  return {
    getTemperatureScaleChangeTrigger: () => temperatureScaleChangeTrigger,
    getStationChangeTrigger: () => stationChangeTrigger,
    getComparisonChangeTrigger: () => comparisonChangeTrigger,
    mockComponents: mocks,
    mockContainers: containerMocks
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
    errorLoadingStations: "Cannot load the stations: blah"
  });

  expect(queryByText("Cannot load the stations: blah")).not.toBeNull();
});

test("passes down the users temperature scale to display", () => {
  const { getByText } = commonAppTest({});

  expect(getByText(new RegExp("SCALE: " + TemperatureScale.CELSIUS))).not.toBeNull();
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
  const addRoutingState = jest.fn();
  const { getStationChangeTrigger } = commonAppTest({ addRoutingState });

  getStationChangeTrigger()({ name: "Elsewhere", id: "33" });

  expect(addRoutingState).toBeCalledTimes(1);
  expect(addRoutingState.mock.calls[0][0]).toStrictEqual("33");
  expect(addRoutingState.mock.calls[0][1]).toStrictEqual(TemperatureDataIds.LAST_SEVEN_DAYS);
});

test("may update the comparison", () => {
  const addRoutingState = jest.fn();
  const { getComparisonChangeTrigger } = commonAppTest({ addRoutingState });

  getComparisonChangeTrigger()(TemperatureDataIds.TODAY_IN_PRIOR_YEARS);

  expect(addRoutingState).toBeCalledTimes(1);
  expect(addRoutingState.mock.calls[0][0]).toStrictEqual("22");
  expect(addRoutingState.mock.calls[0][1]).toStrictEqual(TemperatureDataIds.TODAY_IN_PRIOR_YEARS);
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

test("loads the latest temp", () => {
  const { mockActions } = commonAppTest({ stationId: "22" });

  expect(mockActions.loadLatestTemperature).toBeCalledTimes(1);
});

test("may display a loading error for the latest temperature", () => {
  const { getByText } = commonAppTest({
    errorLoadingLatestTemperature: "No data was found. This product may not be offered at this station at the requested time."
  });

  expect(getByText("No data was found. This product may not be offered at this station at the requested time.")).not.toBeNull();
});

test("may display a recorded timestamp for the latest temperature", () => {
  const { getByText } = commonAppTest({
    latestTemperature: new Temperature(76.1, TemperatureScale.FAHRENHEIT, "2020-03-02 18:42")
  });

  expect(getByText(/2020-03-02 18:42/)).not.toBeNull();
});

test("may display loading for the latest temperature", () => {
  const { getByText } = commonAppTest({
    station: { name: "Somewhere", id: "22" }
  });

  expect(getByText(/loading.../)).not.toBeNull();
});

test("displays the last 24 hour range", () => {
  const { queryByText } = commonAppTest({
    last24Hours: {
      min: new Temperature(32.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:42"),
      max: new Temperature(34.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:54"),
      avg: new Temperature(33.8, TemperatureScale.FAHRENHEIT)
    }
  });

  expect(queryByText(/Min: 32.8/)).not.toBeNull();
  expect(queryByText(/Avg: 33.8/)).not.toBeNull();
  expect(queryByText(/Max: 34.8/)).not.toBeNull();
});

test("loads the last 24 hour range", () => {
  const { mockActions } = commonAppTest({ stationId: "22" });

  expect(mockActions.loadLast24Hours).toBeCalledTimes(1);
});

test("loads the latest temp & last 24 for a new station", async () => {
  let { mockActions, mockComponents, mockContainers, rerender, getByText } = commonAppTest({
    stationId: "22",
    latestTemperature: new Temperature(12.3456, TemperatureScale.FAHRENHEIT)
  });

  rerender(
    <TheWaterTemp
      actions={mockActions}
      dispatch={jest.fn()}
      Components={mockComponents}
      Containers={mockContainers}
      userPreferences={userPreferences}
      addRoutingState={jest.fn()}
      stationId="33"
      loadingStations={false}
      stations={null}
      errorLoadingStations={null}
      latestTemperature={new Temperature(76.1, TemperatureScale.FAHRENHEIT)}
      errorLoadingLatestTemperature={null}
      last24Hours={null}
      comparisonId={TemperatureDataIds.LAST_SEVEN_DAYS}
      path=""
    />
  );

  await wait(() => getByText(/76.1/));

  expect(mockActions.loadLatestTemperature).toBeCalledTimes(2);
  expect(mockActions.loadLast24Hours).toBeCalledTimes(2);
});

test("The time passed to comparison is based on the latest recording", () => {
  const { getByText } = commonAppTest({
    latestTemperature: new Temperature(55.5, TemperatureScale.FAHRENHEIT, "2020-03-06 08:30 UTC")
  });

  expect(getByText(/COMPARISON\s+1583483400000/)).not.toBeNull();
});
