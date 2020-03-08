import nock from "nock";

import { loadTodayInPriorYears } from "./todayInPriorYears";

import { ActionTypes, ComparisonIds, Temperature, TemperatureScale } from "../types";
import { DEFAULTS } from "../defaults";

const testStationId = "22";

const latestStationTime = new Date("2020-03-05 08:30");

function makeNocks() {
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20190305&range=24")
    .reply(200, { data: [{ t: "2019-03-05 15:30", v: "33.6" }] });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20180305&range=24")
    .reply(200, { data: [{ t: "2018-03-05 15:30", v: "33.6" }] });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20170305&range=24")
    .reply(200, {
      error: { message: "No data was found. This product may not be offered at this station at the requested time." }
    });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20160305&range=24")
    .reply(200, {
      error: { message: "No data was found. This product may not be offered at this station at the requested time." }
    });
}

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  makeNocks();

  await loadTodayInPriorYears(dispatch, testStationId, latestStationTime, 1);

  expect(dispatch.mock.calls[0][0]).toStrictEqual({
    type: ActionTypes.LOADING_COMPARISON,
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS
    }
  });
});

it("dispatches the first year", async () => {
  const dispatch = jest.fn();
  makeNocks();

  await loadTodayInPriorYears(dispatch, testStationId, latestStationTime, 1);

  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.PARTIAL_COMPARISON_LOAD,
    payload: {
      regarding: "2019",
      range: {
        min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
        max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2019-03-05 15:30"),
        avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
      }
    },
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS
    }
  });
});

it("and the next", async () => {
  const dispatch = jest.fn();
  makeNocks();

  await loadTodayInPriorYears(dispatch, testStationId, latestStationTime, 1);

  expect(dispatch.mock.calls[2][0]).toStrictEqual({
    type: ActionTypes.PARTIAL_COMPARISON_LOAD,
    payload: {
      regarding: "2018",
      range: {
        min: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2018-03-05 15:30"),
        max: new Temperature(33.6, TemperatureScale.FAHRENHEIT, "2018-03-05 15:30"),
        avg: new Temperature(33.6, TemperatureScale.FAHRENHEIT)
      }
    },
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS
    }
  });
});

it("finishes", async () => {
  const dispatch = jest.fn();
  makeNocks();

  await loadTodayInPriorYears(dispatch, testStationId, latestStationTime, 2);

  expect(dispatch.mock.calls[3][0]).toStrictEqual({
    type: ActionTypes.COMPLETED_COMPARISON_LOAD,
    payload: {
      endReason: "Tried 2017, 2016"
    },
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS
    }
  });
});

function makeNocks2() {
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20190305&range=24")
    .reply(200, { data: [{ t: "2019-03-05 15:30", v: "33.6" }] });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20180305&range=24")
    .reply(200, {
      error: { message: "No data was found. This product may not be offered at this station at the requested time." }
    });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20170305&range=24")
    .reply(200, { data: [{ t: "2017-03-05 15:30", v: "33.6" }] });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20160305&range=24")
    .reply(200, {
      error: { message: "No data was found. This product may not be offered at this station at the requested time." }
    });

  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + testStationId + "&begin_date=20150305&range=24")
    .reply(200, {
      error: { message: "No data was found. This product may not be offered at this station at the requested time." }
    });
}

it("handles gaps", async () => {
  const dispatch = jest.fn();
  makeNocks2();

  await loadTodayInPriorYears(dispatch, testStationId, latestStationTime, 2);

  expect(dispatch.mock.calls[2][0]).toStrictEqual({
    type: ActionTypes.PARTIAL_COMPARISON_LOAD,
    payload: {
      regarding: "2018",
      range: null
    },
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS
    }
  });

  expect(dispatch.mock.calls[4][0]).toStrictEqual({
    type: ActionTypes.COMPLETED_COMPARISON_LOAD,
    payload: {
      endReason: "Tried 2016, 2015"
    },
    meta: {
      stationId: testStationId,
      comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS
    }
  });
});
