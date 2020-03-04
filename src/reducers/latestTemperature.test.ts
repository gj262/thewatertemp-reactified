import reducer, {
  getLatestTemperature,
  isLoading,
  loadFailed,
  getFailureMessage
} from "./latestTemperature";
import { Action, ActionTypes, Temperature, TemperatureScale } from "../types";

it("should return an initial state", () => {
  expect(getLatestTemperature({}, "22")).toBeNull();
});

const loading: Action = {
  type: ActionTypes.LOADING_LATEST_TEMPERATURE,
  meta: { stationId: "22" }
};

it("knows about loading", () => {
  expect(isLoading(reducer({}, loading), "22")).toBe(true);
});

const loads: Action = {
  type: ActionTypes.LATEST_TEMPERATURE_LOADED,
  payload: {
    data: new Temperature(55.8, TemperatureScale.FAHRENHEIT, "2020-02-29 16:36")
  },
  meta: { stationId: "22" }
};

it("loads", () => {
  expect(
    getLatestTemperature(reducer(reducer({}, loading), loads), "22")
  ).toStrictEqual(loads.payload.data);
});

it("is no longer loading", () => {
  expect(isLoading(reducer(reducer({}, loading), loads), "22")).toBe(false);
});

const failure: Action = {
  type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
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

  expect(getLatestTemperature(refreshing, "22")).toStrictEqual(
    loads.payload.data
  );
  expect(isLoading(refreshing, "22")).toBe(false);
});
