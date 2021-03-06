import reducer, { getUserPreferences } from "./userPreferences";
import { ActionTypes, TemperatureScale, Action } from "../types";

it("should return an initial state", () => {
  expect(getUserPreferences(null)).toBeNull();
});

const loaded: Action = {
  type: ActionTypes.USER_PREFERENCES_LOADED,
  payload: {
    temperatureScale: TemperatureScale.FAHRENHEIT
  }
};

it("gets loaded", () => {
  expect(getUserPreferences(reducer(null, loaded))).toStrictEqual(
    loaded.payload
  );
});

const updated: Action = {
  type: ActionTypes.USER_PREFERENCES_UPDATED,
  payload: {
    temperatureScale: TemperatureScale.CELSIUS
  }
};

it("gets updated", () => {
  expect(getUserPreferences(reducer(loaded.payload, updated))).toStrictEqual(
    updated.payload
  );
});
