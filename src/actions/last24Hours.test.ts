import nock from "nock";

import { ActionTypes, Temperature, TemperatureScale } from "../types";
import { loadLast24Hours } from "./last24Hours";
import { DEFAULTS } from "../defaults";

const positiveReplyData = {
  metadata: {
    id: "9414290",
    name: "San Francisco",
    lat: "37.8063",
    lon: "-122.4659"
  },
  data: [
    { t: "2020-03-03 18:42", v: "32.8", f: "0,0,0" },
    { t: "2020-03-03 18:48", v: "33.8", f: "0,0,0" },
    { t: "2020-03-03 18:54", v: "34.8", f: "0,0,0" }
  ]
};

const stationId = "9414290";

const positiveReply = () =>
  nock(DEFAULTS.NOAA_API_HOSTNAME)
    .get(DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&range=24")
    .reply(200, positiveReplyData);

it("dispatches loading", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLast24Hours(dispatch, stationId);

  expect(dispatch).toBeCalledWith({
    type: ActionTypes.LOADING_LAST_24_HOURS,
    meta: { stationId }
  });
});

it("hits the range API", async () => {
  const dispatch = jest.fn();
  const catchit = positiveReply();

  await loadLast24Hours(dispatch, stationId);

  expect(catchit.isDone()).toBeTruthy();
});

it("dispatches the range, min, max, avg", async () => {
  const dispatch = jest.fn();
  positiveReply();

  await loadLast24Hours(dispatch, stationId);

  expect(dispatch).toBeCalledTimes(2);
  expect(dispatch.mock.calls[1][0]).toStrictEqual({
    type: ActionTypes.LAST_24_HOURS_LOADED,
    payload: {
      data: [
        new Temperature(32.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:42"),
        new Temperature(33.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:48"),
        new Temperature(34.8, TemperatureScale.FAHRENHEIT, "2020-03-03 18:54")
      ],
      min: new Temperature(
        32.8,
        TemperatureScale.FAHRENHEIT,
        "2020-03-03 18:42"
      ),
      max: new Temperature(
        34.8,
        TemperatureScale.FAHRENHEIT,
        "2020-03-03 18:54"
      ),
      avg: new Temperature(33.8, TemperatureScale.FAHRENHEIT)
    },
    meta: { stationId }
  });
});
