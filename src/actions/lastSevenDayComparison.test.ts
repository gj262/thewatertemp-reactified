/**
 * @jest-environment node
 */

import nock from "nock";

import { loadLastSevenDayComparison } from "./lastSevenDayComparison";
import { ActionTypes, ComparisonIds, Temperature, TemperatureScale } from "../types";
import { DEFAULTS } from "../defaults";

const testStationId = "22";

const latestStationTime = new Date("2020-03-06 08:30"); // Friday

const positiveReplyData = [
  { t: "2020-02-28 15:30", v: "27.6" },
  { t: "2020-02-29 15:30", v: "28.6" },
  { t: "2020-03-01 15:30", v: "29.6" },
  { t: "2020-03-02 15:30", v: "30.6" },
  { t: "2020-03-03 15:30", v: "31.6" },
  { t: "2020-03-04 15:30", v: "32.6" },
  { t: "2020-03-05 15:30", v: "33.6" }
];

const payloadDataToMatch = [
  {
    regarding: "Thursday",
    range: {
      min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2020-03-05 15:30"),
      max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2020-03-05 15:30"),
      avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Wednesday",
    range: {
      min: new Temperature(32.6, TemperatureScale.FAHRENHEIT, "2020-03-04 15:30"),
      max: new Temperature(32.6, TemperatureScale.FAHRENHEIT, "2020-03-04 15:30"),
      avg: new Temperature(32.6, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Tuesday",
    range: {
      min: new Temperature(31.6, TemperatureScale.FAHRENHEIT, "2020-03-03 15:30"),
      max: new Temperature(31.6, TemperatureScale.FAHRENHEIT, "2020-03-03 15:30"),
      avg: new Temperature(31.6, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Monday",
    range: {
      min: new Temperature(30.6, TemperatureScale.FAHRENHEIT, "2020-03-02 15:30"),
      max: new Temperature(30.6, TemperatureScale.FAHRENHEIT, "2020-03-02 15:30"),
      avg: new Temperature(30.6, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Sunday",
    range: {
      min: new Temperature(29.6, TemperatureScale.FAHRENHEIT, "2020-03-01 15:30"),
      max: new Temperature(29.6, TemperatureScale.FAHRENHEIT, "2020-03-01 15:30"),
      avg: new Temperature(29.6, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Saturday",
    range: {
      min: new Temperature(28.6, TemperatureScale.FAHRENHEIT, "2020-02-29 15:30"),
      max: new Temperature(28.6, TemperatureScale.FAHRENHEIT, "2020-02-29 15:30"),
      avg: new Temperature(28.6, TemperatureScale.FAHRENHEIT)
    }
  },
  {
    regarding: "Friday",
    range: {
      min: new Temperature(27.6, TemperatureScale.FAHRENHEIT, "2020-02-28 15:30"),
      max: new Temperature(27.6, TemperatureScale.FAHRENHEIT, "2020-02-28 15:30"),
      avg: new Temperature(27.6, TemperatureScale.FAHRENHEIT)
    }
  }
];

const positiveReply = () =>
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20200228&range=168")
    .reply(200, { data: positiveReplyData });

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLastSevenDayComparison(dispatch, testStationId, latestStationTime);

  expect(dispatch).toBeCalledWith({
    type: ActionTypes.LOADING_COMPARISON,
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.LAST_SEVEN_DAYS
    }
  });
});

it("asks for 7 days, 7 days ago", async () => {
  const dispatch = jest.fn();
  const catchit = positiveReply();

  await loadLastSevenDayComparison(dispatch, testStationId, latestStationTime);

  expect(catchit.isDone()).toBeTruthy();
});

it("dispatches when loaded", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLastSevenDayComparison(dispatch, testStationId, latestStationTime);

  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.COMPARISON_LOADED,
    payload: {
      data: payloadDataToMatch
    },
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.LAST_SEVEN_DAYS
    }
  });
});
