import reducer, {
  getLast24Hours,
  isLoading,
  loadFailed,
  getFailureMessage
} from "./last24Hours";
import {
  Action,
  ActionTypes,
  Temperature,
  TemperatureScale,
  TemperatureRange
} from "../types";

it("should return an initial state", () => {
  expect(getLast24Hours({}, "22")).toBeNull();
});

const loading: Action = {
  type: ActionTypes.LOADING_LAST_24_HOURS,
  meta: { stationId: "22" }
};

it("knows about loading", () => {
  expect(isLoading(reducer({}, loading), "22")).toBe(true);
});

const loads: Action = {
  type: ActionTypes.LAST_24_HOURS_LOADED,
  payload: {
    data: [
      new Temperature(32.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:42"),
      new Temperature(33.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:48"),
      new Temperature(34.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:54")
    ],
    min: new Temperature(32.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:42"),
    max: new Temperature(34.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:54"),
    avg: new Temperature(33.8, TemperatureScale.FAHRENHEIT)
  },
  meta: { stationId: "22" }
};

const returns: TemperatureRange = {
  min: loads.payload.min,
  max: loads.payload.max,
  avg: loads.payload.avg
};

it("loads", () => {
  expect(
    getLast24Hours(reducer(reducer({}, loading), loads), "22")
  ).toStrictEqual(returns);
});

it("is no longer loading", () => {
  expect(isLoading(reducer(reducer({}, loading), loads), "22")).toBe(false);
});

const failure: Action = {
  type: ActionTypes.FAILED_TO_LOAD_LAST_24_HOURS,
  error: new Error(
    "Cannot load the latest temperature. Request failed with status code 500"
  ),
  meta: {
    stationId: "22"
  }
};

it("may fail to load", () => {
  expect(loadFailed(reducer(reducer({}, loading), loads), "22")).toBe(false);
  expect(loadFailed(reducer({}, loading), "22")).toBe(false);
  expect(loadFailed(reducer(reducer({}, loading), failure), "22")).toBe(true);
});

it("provides the failure", () => {
  expect(getFailureMessage(reducer(reducer({}, loading), failure), "22")).toBe(
    failure.error.message
  );
});

it("refresh is not loading", () => {
  const refreshing = reducer(reducer(reducer({}, loading), loads), loading);

  expect(getLast24Hours(refreshing, "22")).toStrictEqual(returns);
  expect(isLoading(refreshing, "22")).toBe(false);
});
