import { Dispatch } from "redux";

import { fetchData } from "./fetchData";
import { ActionTypes } from "../types";

export function loadLatestTemperature(dispatch: Dispatch, stationId: string) {
  return fetchData(
    dispatch,
    {
      loading: ActionTypes.LOADING_LATEST_TEMPERATURE,
      fetched: ActionTypes.LATEST_TEMPERATURE_LOADED,
      failed: ActionTypes.FAILED_TO_LOAD_LATEST_TEMPERATURE
    },
    { stationId },
    ["date=latest"],
    false
  );
}
