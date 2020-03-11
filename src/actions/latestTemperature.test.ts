/**
 * @jest-environment node
 */

import nock from "nock";

import { loadLatestTemperature } from "./latestTemperature";
import { ActionTypes, Temperature, TemperatureScale, TemperatureDataIds } from "../types";
import { DEFAULTS } from "../defaults";

const positiveReplyData = {
  metadata: {
    id: "9414290",
    name: "San Francisco",
    lat: "37.8063",
    lon: "-122.4659"
  },
  data: [{ t: "2020-02-29 16:36", v: "55.8", f: "0,0,0" }]
};

const stationId = "22";

const positiveReply = () =>
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(200, positiveReplyData);

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledWith({
    type: ActionTypes.LOADING_TEMPERATURE_DATA,
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

it("hits the latest temp API", async () => {
  const dispatch = jest.fn();
  const catchit = positiveReply();

  await loadLatestTemperature(dispatch, stationId);

  expect(catchit.isDone()).toBeTruthy();
});

it("dispatches the latest temp", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.TEMPERATURE_DATA_LOADED,
    payload: {
      data: new Temperature(55.8, TemperatureScale.FAHRENHEIT, "2020-02-29 16:36")
    },
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

it("dispatches an error for non 2xx", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(404, positiveReplyData);

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error: new Error("Request failed with status code 404"),
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

it("dispatches an error for bad data", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(200, {});

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error: new Error("No data was returned"),
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

it("dispatches an error for an error response", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(200, {
      error: {
        message: "No data was found. This product ..."
      }
    });

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error: new Error("No data was found. This product ..."),
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

const makeNegativeReply = (overrideDatum: any) => {
  return {
    metadata: {
      id: "9414290",
      name: "San Francisco",
      lat: "37.8063",
      lon: "-122.4659"
    },
    data: [{ t: "2020-02-29 16:36", v: "55.8", f: "0,0,0", ...overrideDatum }]
  };
};

it("must have a non zero 'v'", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(200, makeNegativeReply({ v: 0.0 }));

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error: new Error("The data is unuseable"),
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

it("must have a 'v'", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  const reply = makeNegativeReply({});
  delete reply.data[0].v;
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(200, reply);

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error: new Error("The data is unuseable"),
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});

it("must have a 'v=t'", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  const reply = makeNegativeReply({});
  delete reply.data[0].t;
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&date=latest")
    .reply(200, reply);

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_TEMPERATURE_DATA,
    error: new Error("The data is unuseable"),
    meta: { stationId, dataId: TemperatureDataIds.LATEST }
  });
});
