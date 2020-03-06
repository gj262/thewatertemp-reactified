import axios from "axios";
import { Dispatch } from "redux";

import { cleanData, min, max, avg } from "./fetchData";
import { ActionTypes, ComparisonIds, Temperature } from "../types";
import { DEFAULTS } from "../defaults";

export function loadLastSevenDayComparison(
  dispatch: Dispatch,
  stationId: string,
  latestStationTime: Date
): Promise<void> {
  const meta = { stationId, comparisonId: ComparisonIds.LAST_SEVEN_DAYS };

  dispatch({
    type: ActionTypes.LOADING_COMPARISON,
    meta
  });

  const stationNowMS = latestStationTime.valueOf();
  var beginMS = stationNowMS - 7 * 24 * 60 * 60 * 1000;
  var beginDate = new Date(beginMS);

  var beginStr =
    beginDate.getFullYear() +
    (beginDate.getMonth() + 1 + "").padStart(2, "0") +
    (beginDate.getDate() + "").padStart(2, "0");

  const dispatchFetchFailed = _dispatchFetchFailed.bind({}, dispatch, meta);

  return axios
    .get(
      DEFAULTS.NOAA_API_HOSTNAME +
        DEFAULTS.TEMPERATURE_DATA_PATH +
        stationId +
        "&begin_date=" +
        beginStr +
        "&range=168"
    )
    .then(response => {
      if (response.data && response.data.error && response.data.error.message) {
        dispatchFetchFailed(response.data.error.message);
        return;
      }

      if (
        !response.data ||
        !response.data.data ||
        !Array.isArray(response.data.data) ||
        response.data.data.length === 0
      ) {
        dispatchFetchFailed("No data was returned");
        return;
      }

      const data = cleanData(response.data.data);

      if (data.length === 0) {
        dispatchFetchFailed("The data is unuseable");
        return;
      }

      const series = [];
      for (var day = 1; day <= 7; day++) {
        var dayMS = stationNowMS - day * 24 * 60 * 60 * 1000;
        var dayDate = new Date(dayMS);
        var dayOfWeek = dayDate.toLocaleString("en-us", { weekday: "long" });
        const dateStr =
          dayDate.getFullYear() +
          "-" +
          (dayDate.getMonth() + 1 + "").padStart(2, "0") +
          "-" +
          (dayDate.getDate() + "").padStart(2, "0");

        const thisData = data.filter(
          (temperature: Temperature) =>
            temperature.timestamp &&
            temperature.timestamp.indexOf(dateStr) === 0
        );

        series.push({
          regarding: dayOfWeek,
          range: data.length
            ? { min: min(thisData), max: max(thisData), avg: avg(thisData) }
            : null
        });
      }

      dispatch({
        type: ActionTypes.COMPARISON_LOADED,
        payload: { data: series },
        meta
      });
    })
    .catch(error => {
      console.log(error);
      console.log(error.toJSON());
      dispatchFetchFailed(error.toJSON().message);
    });
}

function _dispatchFetchFailed(
  dispatch: Dispatch,
  meta: { stationId: string; comparisonId: ComparisonIds },
  message: string
) {
  dispatch({
    type: ActionTypes.FAILED_TO_LOAD_COMPARISON,
    error: new Error(message),
    meta
  });
}
