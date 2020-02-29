import reducer, {
  getStations,
  isLoading,
  loadFailed,
  getFailure
} from "./stations";
import { Action, ActionTypes } from "../types";

it("should return an initial state", () => {
  expect(getStations(null)).toBeNull();
});

const loading: Action = {
  type: ActionTypes.LOADING_STATIONS
};

it("knows about loading", () => {
  expect(isLoading(reducer(null, loading))).toBe(true);
});

const loads: Action = {
  type: ActionTypes.STATIONS_LOADED,
  payload: {
    stations: [
      { name: "Somewhere", id: "22" },
      { name: "Elsewhere", id: "33" }
    ]
  }
};

it("loads", () => {
  expect(getStations(reducer(reducer(null, loading), loads))).toStrictEqual(
    loads.payload.stations
  );
});

it("is no longer loading", () => {
  expect(isLoading(reducer(reducer(null, loading), loads))).toBe(false);
});

const failure: Action = {
  type: ActionTypes.FAILED_TO_LOAD_STATIONS,
  error: new Error("Cannot load the stations list"),
  meta: {
    message: "Request failed with status code 500"
  }
};

it("may fail to load", () => {
  expect(loadFailed(reducer(reducer(null, loading), loads))).toBe(false);
  expect(loadFailed(reducer(null, loading))).toBe(false);
  expect(loadFailed(reducer(reducer(null, loading), failure))).toBe(true);
});

it("provides the failure", () => {
  expect(getFailure(reducer(reducer(null, loading), failure))).toStrictEqual({
    error: failure.error,
    message: failure.meta.message
  });
});
