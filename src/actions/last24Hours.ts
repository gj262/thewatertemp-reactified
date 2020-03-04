import { Dispatch } from "redux";

import { fetchData } from "./fetchData";
import { ActionTypes } from "../types";

export function loadLast24Hours(dispatch: Dispatch, stationId: string) {
  return fetchData(
    dispatch,
    {
      loading: ActionTypes.LOADING_LAST_24_HOURS,
      fetched: ActionTypes.LAST_24_HOURS_LOADED,
      failed: ActionTypes.FAILED_TO_LOAD_LAST_24_HOURS
    },
    { stationId },
    ["range=24"],
    true
  );
}
