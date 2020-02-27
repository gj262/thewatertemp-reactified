import { loadUserPreferences } from "./userPreferences";
import { TemperatureScale, ActionTypes } from "../types";

const defaultAction = {
  type: ActionTypes.USER_PREFERENCES_LOADED,
  payload: {
    temperatureScale: TemperatureScale.FAHRENHEIT
  }
};

test("dispatches the default user preferences", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => null)
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
  expect(localStorage.getItem).toBeCalledTimes(1);
});

test("dispatches stored user preferences", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => {
      return JSON.stringify({ scale: TemperatureScale.CELSIUS });
    })
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith({
    type: ActionTypes.USER_PREFERENCES_LOADED,
    payload: {
      temperatureScale: TemperatureScale.CELSIUS
    }
  });
});

test("resiliency (1)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => "URG")
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("resiliency (2)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => "{}")
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("resiliency (3)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => "URG")
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("resiliency (4)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => {
      return JSON.stringify({ scale: "K" });
    })
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});
