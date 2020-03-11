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

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch);

  expect(dispatch).toBeCalledWith({
    type: ActionTypes.LOADING_STATIONS
  });
});

it("hits the station list API", async () => {
  const dispatch = jest.fn();
  const catchit = nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch);

  expect(catchit.isDone()).toBeTruthy();
});

it("dispatches the list", async () => {
  const dispatch = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(200, positiveReplyData);

  await loadStations(dispatch);

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

it("dispatches an error for non 2xx", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.STATION_LIST_PATH)
    .reply(500, positiveReplyData);

  await loadStations(dispatch);

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

  await loadStations(dispatch);

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

  await loadStations(dispatch);

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

  await loadStations(dispatch);

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
