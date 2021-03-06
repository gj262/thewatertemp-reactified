/**
 * @jest-environment node
 */

import nock from "nock";

import { loadStations } from "./stations";
import { ActionTypes } from "../types";
import { DEFAULTS } from "../defaults";

const positiveReplyData = {
  stations: [
    { name: "Somewhere", id: "22" },
    { name: "Elsewhere", id: "33" }
  ]
};

const notInLocalStorage = {
  getItem: jest.fn((x: string) => null),
  setItem: jest.fn()
};

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch, notInLocalStorage);

  expect(dispatch).toBeCalledWith({
    type: ActionTypes.LOADING_STATIONS
  });
});

it("hits the station list API", async () => {
  const dispatch = jest.fn();
  const catchit = nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch, notInLocalStorage);

  expect(catchit.isDone()).toBeTruthy();
});

it("dispatches the list", async () => {
  const dispatch = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch, notInLocalStorage);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.STATIONS_LOADED,
    payload: {
      stations: [
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]
    }
  });
});

it("caches the list", async () => {
  const dispatch = jest.fn();
  const thisTestLocalStorage = {
    getItem: jest.fn((x: string) => null),
    setItem: jest.fn()
  };
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch, thisTestLocalStorage);

  expect(thisTestLocalStorage.setItem).toBeCalledTimes(1);
  expect(thisTestLocalStorage.setItem.mock.calls[0][0]).toBe("stations");
  expect(JSON.parse(thisTestLocalStorage.setItem.mock.calls[0][1])).toStrictEqual({
    stations: [
      { name: "Somewhere", id: "22" },
      { name: "Elsewhere", id: "33" }
    ]
  });
});

it("dispatches an error for non 2xx", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(500, positiveReplyData);

  await loadStations(dispatch, notInLocalStorage);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_STATIONS,
    error: new Error("Cannot load the stations list. Request failed with status code 500")
  });
});

it("dispatches an error for no stations", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, {});

  await loadStations(dispatch, notInLocalStorage);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_STATIONS,
    error: new Error("Cannot load the stations list. No stations were returned")
  });
});

it("dispatches an error for an error response", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, {
      error: {
        message: "Go away ..."
      }
    });

  await loadStations(dispatch, notInLocalStorage);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_STATIONS,
    error: new Error("Cannot load the stations list. Go away ...")
  });
});

it("must have id and name / keeps 'state' / drops other fields", async () => {
  const dispatch = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, {
      stations: [
        { idless: "1", name: "1" },
        { id: "2", nameless: "2" },
        { id: "3", name: "3", state: "3" },
        { id: "4", name: "4", other: "dropped" }
      ]
    });

  await loadStations(dispatch, notInLocalStorage);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.STATIONS_LOADED,
    payload: {
      stations: [
        { id: "3", name: "3, 3", state: "3" },
        { id: "4", name: "4" }
      ]
    }
  });
});

test("uses the cached stations if present but still refreshes", async () => {
  const dispatch = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(500, positiveReplyData);
  const localStorage = {
    getItem: jest.fn((x: string) => {
      return JSON.stringify({
        stations: [
          { name: "Somewhere", id: "22" },
          { name: "Elsewhere", id: "33" }
        ]
      });
    }),
    setItem: jest.fn()
  };

  await loadStations(dispatch, localStorage);

  expect(dispatch).toBeCalledTimes(3);
  expect(dispatch.mock.calls[0][0]).toStrictEqual({
    type: ActionTypes.STATIONS_LOADED,
    payload: {
      stations: [
        { name: "Somewhere", id: "22" },
        { name: "Elsewhere", id: "33" }
      ]
    }
  });
});
