import { loadUserPreferences, updateUserPreferences } from "./userPreferences";
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
    getItem: jest.fn((x: string) => null),
    setItem: jest.fn()
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
  expect(localStorage.getItem).toBeCalledTimes(1);
});

test("dispatches stored user preferences", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => {
      return JSON.stringify({ temperatureScale: TemperatureScale.CELSIUS });
    }),
    setItem: jest.fn()
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
    getItem: jest.fn((x: string) => "URG"),
    setItem: jest.fn()
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("resiliency (2)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => "{}"),
    setItem: jest.fn()
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("resiliency (3)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => "URG"),
    setItem: jest.fn()
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("resiliency (4)", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn((x: string) => {
      return JSON.stringify({ temperatureScale: "K" });
    }),
    setItem: jest.fn()
  };
  loadUserPreferences(dispatch, localStorage);
  expect(dispatch).toBeCalledWith(defaultAction);
});

test("dispatches updated user preferences", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };
  updateUserPreferences(dispatch, localStorage, {
    temperatureScale: TemperatureScale.CELSIUS
  });
  expect(dispatch).toBeCalledWith({
    type: ActionTypes.USER_PREFERENCES_UPDATED,
    payload: {
      temperatureScale: TemperatureScale.CELSIUS
    }
  });
  expect(localStorage.setItem).toBeCalledTimes(1);
});

test("stores updated user preferences", () => {
  const dispatch = jest.fn();
  const localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };
  updateUserPreferences(dispatch, localStorage, {
    temperatureScale: TemperatureScale.CELSIUS
  });
  expect(localStorage.setItem.mock.calls[0][1]).toBe(
    JSON.stringify({
      temperatureScale: TemperatureScale.CELSIUS
    })
  );
});
