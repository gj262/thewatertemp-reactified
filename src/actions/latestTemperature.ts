import axios from "axios";
import { Dispatch } from "redux";

import { ActionTypes, TemperatureDataIds } from "../types";
import { DEFAULTS } from "../defaults";
import { getDataFromResponseOrReject, cleanData, rejectNoData, handleError } from "./fetchData";

export function loadLatestTemperature(dispatch: Dispatch, stationId: string) {
  const meta = { stationId, dataId: TemperatureDataIds.LATEST };

  dispatch({
    type: ActionTypes.LOADING_TEMPERATURE_DATA,
    meta
  });

  return axios
    .get(DEFAULTS.NOAA_API_HOSTNAME + DEFAULTS.TEMPERATURE_DATA_PATH + meta.stationId + "&date=latest")
    .then(getDataFromResponseOrReject)
    .then(cleanData)
    .then(rejectNoData)
    .then(data => {
      dispatch({
        type: ActionTypes.TEMPERATURE_DATA_LOADED,
        payload: { data: data[0] },
        meta
      });
    })
    .catch(error => handleError(error, dispatch, meta));
}
