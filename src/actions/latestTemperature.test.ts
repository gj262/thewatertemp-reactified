import nock from "nock";

import { loadLatestTemperature } from "./latestTemperature";
import { ActionTypes, Temperature, TemperatureScale } from "../types";
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
  nock(DEFAULTS.LATEST_TEMPERATURE_HOSTNAME)
    .get(DEFAULTS.LATEST_TEMPERATURE_PATH + stationId + "&date=latest")
    .reply(200, positiveReplyData);

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledWith({
    type: ActionTypes.LOADING_LATEST_TEMPERATURE,
    meta: { stationId }
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
    type: ActionTypes.LATEST_TEMPERATURE_LOADED,
    payload: {
      temperature: new Temperature(
        55.8,
        TemperatureScale.FAHRENHEIT,
        "2020-02-29 16:36"
      )
    },
    meta: { stationId }
  });
});

it("dispatches an error for non 2xx", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.LATEST_TEMPERATURE_HOSTNAME)
    .get(DEFAULTS.LATEST_TEMPERATURE_PATH + stationId + "&date=latest")
    .reply(404, positiveReplyData);

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
    error: new Error("Cannot load the temperature data"),
    meta: { message: "Request failed with status code 404", stationId }
  });
});

it("dispatches an error for bad data", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  nock(DEFAULTS.LATEST_TEMPERATURE_HOSTNAME)
    .get(DEFAULTS.LATEST_TEMPERATURE_PATH + stationId + "&date=latest")
    .reply(200, {});

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
    error: new Error("Cannot load the temperature data"),
    meta: { message: "No data was returned", stationId }
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
  nock(DEFAULTS.LATEST_TEMPERATURE_HOSTNAME)
    .get(DEFAULTS.LATEST_TEMPERATURE_PATH + stationId + "&date=latest")
    .reply(200, makeNegativeReply({ v: 0.0 }));

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
    error: new Error("Cannot load the temperature data"),
    meta: { message: "The data is unuseable", stationId }
  });
});

it("must have a 'v'", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  const reply = makeNegativeReply({});
  delete reply.data[0].v;
  nock(DEFAULTS.LATEST_TEMPERATURE_HOSTNAME)
    .get(DEFAULTS.LATEST_TEMPERATURE_PATH + stationId + "&date=latest")
    .reply(200, reply);

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
    error: new Error("Cannot load the temperature data"),
    meta: { message: "The data is unuseable", stationId }
  });
});

it("must have a 'v=t'", async () => {
  const dispatch = jest.fn();
  console.log = jest.fn();
  const reply = makeNegativeReply({});
  delete reply.data[0].t;
  nock(DEFAULTS.LATEST_TEMPERATURE_HOSTNAME)
    .get(DEFAULTS.LATEST_TEMPERATURE_PATH + stationId + "&date=latest")
    .reply(200, reply);

  await loadLatestTemperature(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE,
    error: new Error("Cannot load the temperature data"),
    meta: { message: "The data is unuseable", stationId }
  });
});
