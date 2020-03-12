import axios from "axios";
import { Dispatch } from "redux";

import { ActionTypes, TemperatureDataIds } from "../types";
import { DEFAULTS } from "../defaults";
import { getDataFromResponseOrReject, cleanData, rejectNoData, min, max, avg, handleError } from "./fetchData";

export function loadLast24Hours(dispatch: Dispatch, stationId: string) {
  const meta = { stationId, dataId: TemperatureDataIds.LAST_24_HOURS };

  dispatch({
    type: ActionTypes.LOADING_TEMPERATURE_DATA,
    meta
  });

  return axios
    .get(DEFAULTS.NOAA_API_HOSTNAME + DEFAULTS.TEMPERATURE_DATA_PATH + meta.stationId + "&range=24")
    .then(getDataFromResponseOrReject)
    .then(cleanData)
    .then(rejectNoData)
    .then(data => {
      dispatch({
        type: ActionTypes.TEMPERATURE_DATA_LOADED,
        payload: { data: { min: min(data), max: max(data), avg: avg(data) } },
        meta
      });
    })
    .catch(error => handleError(error, dispatch, meta));
}
