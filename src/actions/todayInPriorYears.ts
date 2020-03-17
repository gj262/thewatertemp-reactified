import axios from "axios";
import { Dispatch } from "redux";

import { getDataFromResponseOrReject, cleanData, min, max, avg, rejectNoData } from "./fetchData";
import { ActionTypes, TemperatureDataIds, Temperature, PartialComparisonListLoadAction } from "../types";
import { DEFAULTS } from "../defaults";

export function loadTodayInPriorYears(
  dispatch: Dispatch,
  stationId: string,
  latestStationTime: Date,
  endAfter: number = 5
): { promise: Promise<void>; cancel: () => void } {
  const meta = { stationId, dataId: TemperatureDataIds.TODAY_IN_PRIOR_YEARS };

  dispatch({
    type: ActionTypes.LOADING_TEMPERATURE_DATA,
    meta
  });

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  return { promise: getTodaysDataForYear(latestStationTime.getFullYear() - 1, []), cancel: source.cancel };

  function getTodaysDataForYear(year: number, consecutiveFailingYears: number[]): Promise<void> {
    return axios
      .get(getURLForYear(year), { cancelToken: source.token })
      .then(getDataFromResponseOrReject)
      .then(cleanData)
      .then(rejectNoData)
      .then(handleData)
      .catch(handleError);

    function handleData(data: Temperature[]): Promise<void> {
      consecutiveFailingYears.forEach((failedYear: number) => {
        dispatch({
          type: ActionTypes.PARTIAL_COMPARISON_LIST_LOAD,
          payload: {
            data: {
              regarding: `${failedYear}`
            }
          },
          meta
        } as PartialComparisonListLoadAction);
      });

      dispatch({
        type: ActionTypes.PARTIAL_COMPARISON_LIST_LOAD,
        payload: {
          data: {
            regarding: `${year}`,
            range: data.length ? { min: min(data), max: max(data), avg: avg(data) } : null
          }
        },
        meta
      } as PartialComparisonListLoadAction);

      return getTodaysDataForYear(year - 1, []);
    }

    function handleError(error: any): Promise<void> | undefined {
      try {
        console.log(error.toJSON());
      } catch (e) {}

      consecutiveFailingYears = [...consecutiveFailingYears, year];

      if (consecutiveFailingYears.length >= endAfter) {
        dispatch({
          type: ActionTypes.COMPLETED_COMPARISON_LIST_LOAD,
          payload: { endReason: `Tried ${consecutiveFailingYears.join(", ")}` },
          meta
        });
      } else {
        return getTodaysDataForYear(year - 1, consecutiveFailingYears);
      }
    }
  }

  function getDateButFudgeLeapYear(date: Date) {
    if (date.getMonth() === 1 && date.getDate() === 29) {
      return 28;
    }
    return date.getDate();
  }

  function getURLForYear(year: number): string {
    const beginStr =
      year +
      (latestStationTime.getMonth() + 1 + "").padStart(2, "0") +
      (getDateButFudgeLeapYear(latestStationTime) + "").padStart(2, "0");

    return DEFAULTS.NOAA_API_HOSTNAME + DEFAULTS.TEMPERATURE_DATA_PATH + stationId + "&begin_date=" + beginStr + "&range=24";
  }
}
