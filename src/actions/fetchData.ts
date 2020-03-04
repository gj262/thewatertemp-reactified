import { Dispatch } from "redux";
import axios from "axios";
import {
  Temperature,
  ActionTypes,
  TemperatureScale,
  FetchDataStageTypes,
  FetchDataMeta
} from "../types";
import { DEFAULTS } from "../defaults";

export function fetchData(
  dispatch: Dispatch,
  stageTypes: FetchDataStageTypes,
  meta: FetchDataMeta,
  path: string[],
  range: boolean
) {
  dispatch({
    type: stageTypes.loading,
    meta
  });

  const dispatchFetchFailed = _dispatchFetchFailed.bind(
    {},
    dispatch,
    meta,
    stageTypes.failed
  );

  return axios
    .get(
      DEFAULTS.NOAA_API_HOSTNAME +
        DEFAULTS.TEMPERATURE_DATA_PATH +
        meta.stationId +
        "&" +
        path.join("&")
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

      const data = _cleanData(response.data.data);

      if (data.length === 0) {
        dispatchFetchFailed("The data is unuseable");
        return;
      }

      dispatch({
        type: stageTypes.fetched,
        payload: range
          ? { data, min: _min(data), max: _max(data), avg: _avg(data) }
          : { data: data[0] },
        meta
      });
    })
    .catch(error => {
      console.log(error.toJSON());
      dispatchFetchFailed(error.toJSON().message);
    });
}

function _dispatchFetchFailed(
  dispatch: Dispatch,
  meta: FetchDataMeta,
  type: ActionTypes,
  message: string
) {
  dispatch({
    type,
    error: new Error(message),
    meta
  });
}

function _cleanData(data: any[]): Temperature[] {
  return data
    .filter((datum: any) => datum.t && datum.v)
    .map(datum => {
      let value = 0;
      let time = "";
      try {
        value = parseFloat(datum.v);
        time = datum.t;
      } catch (e) {
        console.log(e.message);
        console.log("dropping: ", datum);
        value = 0;
      }
      return new Temperature(value, TemperatureScale.FAHRENHEIT, time);
    })
    .filter(t => t.value && t.timestamp);
}

function _min(data: Temperature[]) {
  return data.reduce((accumulator, current) => {
    if (current.value < accumulator.value) {
      accumulator = current;
    }
    return accumulator;
  }, data[0]);
}

function _max(data: Temperature[]) {
  return data.reduce((accumulator, current) => {
    if (current.value > accumulator.value) {
      accumulator = current;
    }
    return accumulator;
  }, data[0]);
}

function _avg(data: Temperature[]) {
  return new Temperature(
    data.reduce((accumulator, current) => accumulator + current.value, 0) /
      data.length,
    data[0].scale
  );
}
