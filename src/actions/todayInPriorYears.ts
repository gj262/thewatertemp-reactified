import axios, { AxiosResponse, AxiosPromise } from "axios";
import { Dispatch } from "redux";

import { cleanData, min, max, avg } from "./fetchData";
import { ActionTypes, ComparisonIds, Temperature } from "../types";
import { DEFAULTS } from "../defaults";

export function loadTodayInPriorYears(
  dispatch: Dispatch,
  stationId: string,
  latestStationTime: Date,
  endAfter: number = 5
): AxiosPromise {
  const meta = { stationId, comparisonId: ComparisonIds.TODAY_IN_PRIOR_YEARS };

  dispatch({
    type: ActionTypes.LOADING_COMPARISON,
    meta
  });

  return getTodaysDataForYear(latestStationTime.getFullYear() - 1, []);

  function getTodaysDataForYear(year: number, consecutiveFailingYears: number[]): Promise<any> {
    return axios
      .get(getURLForYear(year))
      .then(rejectInvalidResponse)
      .then(cleanData)
      .then(handleData)
      .catch(handleError);

    function handleData(data: Temperature[]): AxiosPromise {
      consecutiveFailingYears.forEach((failedYear: number) => {
        dispatch({
          type: ActionTypes.PARTIAL_COMPARISON_LOAD,
          payload: {
            regarding: `${failedYear}`,
            range: null
          },
          meta
        });
      });

      dispatch({
        type: ActionTypes.PARTIAL_COMPARISON_LOAD,
        payload: {
          regarding: `${year}`,
          range: data.length ? { min: min(data), max: max(data), avg: avg(data) } : null
        },
        meta
      });

      return getTodaysDataForYear(year - 1, []);
    }

    function handleError(error: any): AxiosPromise | undefined {
      try {
        console.log(error.toJSON());
      } catch (e) {}

      consecutiveFailingYears = [...consecutiveFailingYears, year];

      if (consecutiveFailingYears.length >= endAfter) {
        dispatch({
          type: ActionTypes.COMPLETED_COMPARISON_LOAD,
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

  function rejectInvalidResponse(response: AxiosResponse): any[] {
    if (response.data && response.data.error && response.data.error.message) {
      throw new Error(response.data.error.message);
    }

    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      throw new Error("Bad response");
    }

    return response.data.data;
  }
}
