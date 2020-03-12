import axios from "axios";
import { Dispatch } from "redux";

import { getDataFromResponseOrReject, cleanData, min, max, avg, rejectNoData, handleError } from "./fetchData";
import { ActionTypes, Temperature, ComparisonList, TemperatureDataIds } from "../types";
import { DEFAULTS } from "../defaults";

export function loadLastSevenDayComparison(dispatch: Dispatch, stationId: string, latestStationTime: Date): Promise<void> {
  const meta = { stationId, dataId: TemperatureDataIds.LAST_SEVEN_DAYS };

  dispatch({
    type: ActionTypes.LOADING_TEMPERATURE_DATA,
    meta
  });

  const stationNowMS = latestStationTime.valueOf();
  const beginMS = stationNowMS - 7 * 24 * 60 * 60 * 1000;
  const beginDate = new Date(beginMS);

  const beginStr =
    beginDate.getFullYear() + (beginDate.getMonth() + 1 + "").padStart(2, "0") + (beginDate.getDate() + "").padStart(2, "0");

  return axios
    .get(DEFAULTS.NOAA_API_HOSTNAME + DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&begin_date=" + beginStr + "&range=168")
    .then(getDataFromResponseOrReject)
    .then(cleanData)
    .then(rejectNoData)
    .then((data: Temperature[]) => {
      const series: ComparisonList = [];
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
          (temperature: Temperature) => temperature.timestamp && temperature.timestamp.indexOf(dateStr) === 0
        );

        series.push({
          regarding: dayOfWeek,
          range: data.length ? { min: min(thisData), max: max(thisData), avg: avg(thisData) } : undefined
        });
      }

      dispatch({
        type: ActionTypes.TEMPERATURE_DATA_LOADED,
        payload: { data: series },
        meta
      });
    })
    .catch(error => handleError(error, dispatch, meta));
}
